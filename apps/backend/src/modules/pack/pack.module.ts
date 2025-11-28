import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { Module } from '@nestjs/common';

import { CreatePackService } from './application/commands/create-pack/create-pack.service';
import { UpdatePackService } from './application/commands/update-pack/update-pack.service';
import { GetPacksService } from './application/queries/get-packs/get-packs.service';
import { CreatePackHttpController } from './infrastructure/http/controllers/create-pack.http.controller';
import { GetPacksHttpController } from './infrastructure/http/controllers/get-packs.http.controller';
import { UpdatePackHttpController } from './infrastructure/http/controllers/update-pack.http.controller';
import { PackRepository } from './infrastructure/persistence/pack.repository';
import { PACK_REPOSITORY } from './pack.di-tokens';

@Module({
  imports: [],
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
