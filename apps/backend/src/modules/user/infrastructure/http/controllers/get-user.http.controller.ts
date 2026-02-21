import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { GetUserCommand } from '@modules/user/application/queries/get-user/get-user.command';
import { GetUserService } from '@modules/user/application/queries/get-user/get-user.service';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';
import { UserDto, UserRoles } from 'shared';

import { mapUserToDto } from '../mappers/user.mapper';

@Controller('user/me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.USER)
export class GetUserHttpController {
  private readonly logger = new Logger(GetUserHttpController.name);

  constructor(private readonly getUserService: GetUserService) {}

  @Get()
  async getUser(@Request() req: { user: AuthenticatedUser }): Promise<UserDto> {
    const { id } = req.user;

    const user = await this.getUserService.execute(
      new GetUserCommand({ userId: id, metadata: { userId: id } }),
    );
    return mapUserToDto(user);
  }
}
