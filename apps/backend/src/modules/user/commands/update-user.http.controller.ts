import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Controller, Logger, Patch, UseGuards, Request, Body } from '@nestjs/common';
import { UserDto } from '@shared';

import { UpdateUserCommand } from './update-user.command';
import { UpdateUserService } from './update-user.service';

@Controller('user/me')
export class UpdateUserHttpController {
  private readonly logger = new Logger(UpdateUserHttpController.name);

  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req: { user: AuthenticatedUser }, @Body() body: UserDto) {
    const { id } = req.user;

    const user = await this.updateUserService.execute(
      new UpdateUserCommand({
        userId: id,
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        phoneNumber: body.phoneNumber,
      }),
    );

    return {
      id: user.id,
      email: user.email.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      currentScore: user.currentScore,
      createdAt: user.createdAt,
    };
  }
}
