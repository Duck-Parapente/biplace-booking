import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';
import { UserDto } from 'shared';

import { mapUserToDto } from './user.mapper';

import { GetUserCommand } from './get-user.command';
import { GetUserService } from './get-user.service';

@Controller('user/me')
export class GetUserHttpController {
  private readonly logger = new Logger(GetUserHttpController.name);

  constructor(private readonly getUserService: GetUserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req: { user: AuthenticatedUser }): Promise<UserDto> {
    const { id } = req.user;

    const user = await this.getUserService.execute(new GetUserCommand({ userId: id }));
    return mapUserToDto(user);
  }
}
