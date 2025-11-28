import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { GetUserCommand } from '@modules/user/application/queries/get-user/get-user.command';
import { GetUserService } from '@modules/user/application/queries/get-user/get-user.service';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';
import { UserDto } from 'shared';

import { mapUserToDto } from '../mappers/user.mapper';

@Controller('user/me')
@UseGuards(JwtAuthGuard)
export class GetUserHttpController {
  private readonly logger = new Logger(GetUserHttpController.name);

  constructor(private readonly getUserService: GetUserService) {}

  @Get()
  async getUser(@Request() req: { user: AuthenticatedUser }): Promise<UserDto> {
    const { id } = req.user;

    const user = await this.getUserService.execute(
      new GetUserCommand({ userId: id, metadata: { userId: id.uuid } }),
    );
    return mapUserToDto(user);
  }
}
