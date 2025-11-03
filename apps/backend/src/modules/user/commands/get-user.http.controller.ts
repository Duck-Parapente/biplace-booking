import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { JwtPayload } from '@libs/guards/jwt.strategy';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';

@Controller('user')
export class GetUserHttpController {
  private readonly logger = new Logger(GetUserHttpController.name);

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req: { user: JwtPayload }) {
    this.logger.log(`User authenticated: ${req.user.sub}`);
    return {
      message: 'User fetched successfully',
      user: req.user,
    };
  }
}
