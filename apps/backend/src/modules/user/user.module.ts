import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { Module } from '@nestjs/common';

import { SyncExternalUserService } from './application/commands/sync-external-user/sync-external-user.service';
import { UpdateUserService } from './application/commands/update-user/update-user.service';
import { GetUserService } from './application/queries/get-user/get-user.service';
import { GetUsersService } from './application/queries/get-users/get-users.service';
import { GetUserHttpController } from './infrastructure/http/controllers/get-user.http.controller';
import { GetUsersHttpController } from './infrastructure/http/controllers/get-users.http.controller';
import { SyncExternalUserHttpController } from './infrastructure/http/controllers/sync-external-user.http.controller';
import { UpdateUserHttpController } from './infrastructure/http/controllers/update-user.http.controller';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { USER_REPOSITORY } from './user.di-tokens';

@Module({
  imports: [],
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
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: 'USER_REPOSITORY_FOR_AUTH', useClass: UserRepository },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
})
export class UserModule {}
