import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IdentityProviderPort } from '../providers/identity.provider.port';
import { IDENTITY_PROVIDER } from '../user.di-tokens';

import { SyncExternalUserCommand } from './sync-external-user.command';

@CommandHandler(SyncExternalUserCommand)
export class SyncExternalUserService implements ICommandHandler<SyncExternalUserCommand, void> {
  private readonly logger = new Logger(SyncExternalUserService.name);

  constructor(
    @Inject(IDENTITY_PROVIDER)
    protected readonly identityProvider: IdentityProviderPort,
  ) {}

  async execute(command: SyncExternalUserCommand): Promise<void> {
    this.logger.log(`External user email: ${command.email.email}`);
  }
}
