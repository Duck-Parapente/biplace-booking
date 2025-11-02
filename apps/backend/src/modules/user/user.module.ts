import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SyncExternalUserHttpController } from './commands/sync-external-user.http.controller';
import { SyncExternalUserService } from './commands/sync-external-user.service';
import { IdentityProvider } from './providers/identity/identity.provider';
import { IDENTITY_PROVIDER, USER_REPOSITORY } from './user.di-tokens';
import { UserRepository } from './providers/database/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [SyncExternalUserHttpController],
  providers: [
    SyncExternalUserService,
    { provide: IDENTITY_PROVIDER, useClass: IdentityProvider },
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
})
export class UserModule {}
