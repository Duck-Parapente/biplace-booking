import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';

import { GetUserCommand } from './get-user.command';
import { GetUserService } from './get-user.service';

@Controller('user')
export class GetUserHttpController {
  private readonly logger = new Logger(GetUserHttpController.name);

  constructor(private readonly getUserService: GetUserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req: { user: AuthenticatedUser }) {
    const { id } = req.user;

    const user = await this.getUserService.execute(new GetUserCommand({ userId: id }));

    return {
      id: user.id,
      email: user.email.email,
      externalAuthId: user.externalAuthId,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      currentScore: user.currentScore,
      createdAt: user.createdAt,
    };
  }
}
