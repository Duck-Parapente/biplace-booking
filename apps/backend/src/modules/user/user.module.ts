import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { FeatureFlagModule } from '@modules/feature-flag/feature-flag.module';
import { Module } from '@nestjs/common';

import { GetUserHttpController } from './commands/get-user.http.controller';
import { GetUserService } from './commands/get-user.service';
import { GetUsersHttpController } from './commands/get-users.http.controller';
import { GetUsersService } from './commands/get-users.service';
import { SyncExternalUserHttpController } from './commands/sync-external-user.http.controller';
import { SyncExternalUserService } from './commands/sync-external-user.service';
import { UpdateUserHttpController } from './commands/update-user.http.controller';
import { UpdateUserService } from './commands/update-user.service';
import { UserRepository } from './providers/user.repository';
import { USER_REPOSITORY } from './user.di-tokens';

@Module({
  imports: [FeatureFlagModule],
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
