import { Email } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { CreateUserCommand } from '@modules/user/application/commands/create-user/create-user.command';
import { CreateUserService } from '@modules/user/application/commands/create-user/create-user.service';
import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { UserRoles } from 'shared';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class CreateUserHttpController {
  private readonly logger = new Logger(CreateUserHttpController.name);

  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async createUser(@Body() { email }: { email: string }) {
    const command = new CreateUserCommand({
      email: new Email({ email }),
      metadata: { userId: UUID.empty() },
    });

    await this.createUserService.execute(command);

    return { message: 'User creation completed' };
  }
}
