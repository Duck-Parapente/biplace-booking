import { EventEmitter } from '@libs/events/database/event-emitter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SyncExternalUserHttpController } from './commands/sync-external-user.http.controller';
import { SyncExternalUserService } from './commands/sync-external-user.service';
import { UserRepository } from './providers/database/user.repository';
import { IdentityProvider } from './providers/identity/identity.provider';
import { EVENT_EMITTER, IDENTITY_PROVIDER, USER_REPOSITORY } from './user.di-tokens';

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
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
})
export class UserModule {}
