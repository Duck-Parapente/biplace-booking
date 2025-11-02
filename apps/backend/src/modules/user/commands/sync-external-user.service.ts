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
    const externalUser = await this.identityProvider.getExternalUserById(command.externalAuthId);

    if (!externalUser) {
      this.logger.warn(`External user not found: ${command.externalAuthId}`);
      return;
    }

    this.logger.log(`External user email: ${externalUser.email.email}`);
  }
}
