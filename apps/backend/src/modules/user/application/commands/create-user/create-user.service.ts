import { AuthProviderPort } from '@modules/user/domain/ports/auth-provider.port';
import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserEntity } from '@modules/user/domain/user.entity';
import { AUTH_PROVIDER, USER_REPOSITORY } from '@modules/user/user.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand, void> {
  private readonly logger = new Logger(CreateUserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(AUTH_PROVIDER)
    private readonly authProvider: AuthProviderPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const externalAuthId = await this.authProvider.findOrCreate(command.email);

    const user = UserEntity.create({
      email: command.email,
      externalAuthId,
    });

    await this.userRepository.create(user);
  }
}
