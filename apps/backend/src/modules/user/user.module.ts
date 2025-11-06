import { EventEmitter } from '@libs/events/database/event-emitter';
import { JwtStrategy } from '@libs/guards/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { GetUserHttpController } from './commands/get-user.http.controller';
import { GetUserService } from './commands/get-user.service';
import { GetUsersHttpController } from './commands/get-users.http.controller';
import { GetUsersService } from './commands/get-users.service';
import { SyncExternalUserHttpController } from './commands/sync-external-user.http.controller';
import { SyncExternalUserService } from './commands/sync-external-user.service';
import { UpdateUserHttpController } from './commands/update-user.http.controller';
import { UpdateUserService } from './commands/update-user.service';
import { UserRepository } from './providers/database/user.repository';
import { IdentityProvider } from './providers/identity/identity.provider';
import { EVENT_EMITTER, IDENTITY_PROVIDER, USER_REPOSITORY } from './user.di-tokens';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    SyncExternalUserHttpController,
    GetUserHttpController,
    GetUsersHttpController,
    UpdateUserHttpController,
  ],
  providers: [
    SyncExternalUserService,
    GetUserService,
    GetUsersService,
    UpdateUserService,
    JwtStrategy,
    { provide: IDENTITY_PROVIDER, useClass: IdentityProvider },
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: 'USER_REPOSITORY_FOR_AUTH', useClass: UserRepository },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
})
export class UserModule {}
