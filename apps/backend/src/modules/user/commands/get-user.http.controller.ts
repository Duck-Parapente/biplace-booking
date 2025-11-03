import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';

@Controller('user')
export class GetUserHttpController {
  private readonly logger = new Logger(GetUserHttpController.name);

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req: { user: AuthenticatedUser }) {
    const { id } = req.user;
    this.logger.log(`User fetched: ${id}`);

    return {
      message: 'User fetched successfully',
      user: {
        id,
      },
    };
  }
}
