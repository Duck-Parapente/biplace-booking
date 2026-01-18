import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { UpdateUserCommand } from '@modules/user/application/commands/update-user/update-user.command';
import { UpdateUserService } from '@modules/user/application/commands/update-user/update-user.service';
import { Controller, Logger, Patch, UseGuards, Request, Body, Param } from '@nestjs/common';
import { AdminUpdateUserProfileDto, UserDto, UserProfileDto, UserRoles } from 'shared';

import { mapUserToDto } from '../mappers/user.mapper';

@Controller('user')
@UseGuards(JwtAuthGuard, MaintenanceModeGuard)
export class UpdateUserHttpController {
  private readonly logger = new Logger(UpdateUserHttpController.name);

  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch('/me')
  async updateUser(
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
    @Body() profile: UserProfileDto,
  ): Promise<UserDto> {
    const user = await this.updateUserService.execute(
      new UpdateUserCommand({
        userId,
        profile,
        metadata: { userId },
      }),
    );

    return mapUserToDto(user);
  }

  @Patch('/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  async adminUpdateUser(
    @Request() { user: { id: adminId } }: { user: AuthenticatedUser },
    @Param('userId') userId: string,
    @Body() profile: AdminUpdateUserProfileDto,
  ): Promise<UserDto> {
    this.logger.log(`Admin ${adminId} is updating user ${userId}`);

    const user = await this.updateUserService.execute(
      new UpdateUserCommand({
        userId: new UUID({ uuid: userId }),
        profile: {
          isActive: profile.isActive,
          activeUntil: profile.activeUntil
            ? DateValueObject.fromDate(new Date(profile.activeUntil))
            : null,
        },
        metadata: { userId: adminId },
      }),
    );

    return mapUserToDto(user);
  }
}
