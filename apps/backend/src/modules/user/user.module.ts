import { Module } from '@nestjs/common';

import { SyncExternalUserHttpController } from './commands/sync-external-user.http.controller';
import { SyncExternalUserService } from './commands/sync-external-user.service';
import { IdentityProvider } from './providers/identity.provider';
import { IDENTITY_PROVIDER } from './user.di-tokens';

@Module({
  controllers: [SyncExternalUserHttpController],
  providers: [SyncExternalUserService, { provide: IDENTITY_PROVIDER, useClass: IdentityProvider }],
})
export class UserModule {}
