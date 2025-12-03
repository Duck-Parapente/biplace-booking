import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserEntity } from '@modules/user/domain/user.entity';
import { USER_REPOSITORY } from '@modules/user/user.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SyncExternalUserCommand } from './sync-external-user.command';

@CommandHandler(SyncExternalUserCommand)
export class SyncExternalUserService implements ICommandHandler<SyncExternalUserCommand, void> {
  private readonly logger = new Logger(SyncExternalUserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: SyncExternalUserCommand): Promise<void> {
    const user = UserEntity.create({
      email: command.email,
      externalAuthId: command.externalAuthId,
    });

    await this.userRepository.create(user);
  }
}
