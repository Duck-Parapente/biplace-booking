import { Module } from '@nestjs/common';

import { SyncExternalUserService } from './commands/sync-external-user.service';
import { IdentityProvider } from './providers/identity.provider';
import { IDENTITY_PROVIDER } from './user.di-tokens';

@Module({
  controllers: [UserHttpControlleR],
  providers: [SyncExternalUserService, { provide: IDENTITY_PROVIDER, useClass: IdentityProvider }],
})
export class UserModule {}
