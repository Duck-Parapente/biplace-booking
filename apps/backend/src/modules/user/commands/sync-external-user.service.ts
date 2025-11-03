import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IdentityProviderPort } from '../domain/ports/identity.provider.port';
import { UserRepositoryPort } from '../domain/ports/user.repository.port';
import { UserEntity } from '../domain/user.entity';
import { EVENT_EMITTER, IDENTITY_PROVIDER, USER_REPOSITORY } from '../user.di-tokens';

import { SyncExternalUserCommand } from './sync-external-user.command';

@CommandHandler(SyncExternalUserCommand)
export class SyncExternalUserService implements ICommandHandler<SyncExternalUserCommand, void> {
  private readonly logger = new Logger(SyncExternalUserService.name);

  constructor(
    @Inject(IDENTITY_PROVIDER)
    protected readonly identityProvider: IdentityProviderPort,
    @Inject(USER_REPOSITORY)
    protected readonly userRepository: UserRepositoryPort,
    @Inject(EVENT_EMITTER)
    protected readonly eventEmitter: EventEmitterPort,
  ) {}

  async execute(command: SyncExternalUserCommand): Promise<void> {
    const user = UserEntity.create({
      email: command.email,
      externalAuthId: command.externalAuthId,
    });

    await this.userRepository.save(user);
    await user.publishEvents(this.eventEmitter);

    this.logger.log(`User synced: ${user.id} (${user.email})`);
  }
}
