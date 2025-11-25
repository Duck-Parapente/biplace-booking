import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Controller, Logger, Patch, UseGuards, Request, Body } from '@nestjs/common';
import { UserDto, UserProfileDto } from 'shared';

import { UpdateUserCommand } from './update-user.command';
import { UpdateUserService } from './update-user.service';
import { mapUserToDto } from './user.mapper';

@Controller('user/me')
@UseGuards(JwtAuthGuard, MaintenanceModeGuard)
export class UpdateUserHttpController {
  private readonly logger = new Logger(UpdateUserHttpController.name);

  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch()
  async updateUser(
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
    @Body() profile: UserProfileDto,
  ): Promise<UserDto> {
    const user = await this.updateUserService.execute(
      new UpdateUserCommand({
        userId,
        profile,
        metadata: { userId: userId.uuid },
      }),
    );

    return mapUserToDto(user);
  }
}
