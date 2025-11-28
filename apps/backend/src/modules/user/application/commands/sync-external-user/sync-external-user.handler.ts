import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { UserEntity } from '../../../domain/user.entity';
import { USER_REPOSITORY } from '../../../user.di-tokens';

import { SyncExternalUserCommand } from './sync-external-user.command';

@CommandHandler(SyncExternalUserCommand)
export class SyncExternalUserService implements ICommandHandler<SyncExternalUserCommand, void> {
  private readonly logger = new Logger(SyncExternalUserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: SyncExternalUserCommand): Promise<void> {
    const user = UserEntity.create({
      email: command.email,
      externalAuthId: command.externalAuthId,
    });

    await this.userRepository.create(user);
  }
}
