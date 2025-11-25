import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { FeatureFlagModule } from '@modules/feature-flag/feature-flag.module';
import { Module } from '@nestjs/common';

import { CreatePackHttpController } from './commands/create-pack.http.controller';
import { CreatePackService } from './commands/create-pack.service';
import { GetPacksHttpController } from './commands/get-packs.http.controller';
import { GetPacksService } from './commands/get-packs.service';
import { UpdatePackHttpController } from './commands/update-pack.http.controller';
import { UpdatePackService } from './commands/update-pack.service';
import { PACK_REPOSITORY } from './pack.di-tokens';
import { PackRepository } from './providers/pack.repository';

@Module({
  imports: [FeatureFlagModule],
  controllers: [CreatePackHttpController, GetPacksHttpController, UpdatePackHttpController],
  providers: [
    CreatePackService,
    GetPacksService,
    UpdatePackService,
    { provide: PACK_REPOSITORY, useClass: PackRepository },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
  exports: [GetPacksService],
})
export class PackModule {}
