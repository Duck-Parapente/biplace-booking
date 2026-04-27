import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { Module } from '@nestjs/common';

import { CreatePackService } from './application/commands/create-pack/create-pack.service';
import { CreatePackNoteService } from './application/commands/create-pack-note/create-pack-note.service';
import { UpdatePackService } from './application/commands/update-pack/update-pack.service';
import { GetPackNotesService } from './application/queries/get-pack-notes/get-pack-notes.service';
import { GetPacksService } from './application/queries/get-packs/get-packs.service';
import { CreatePackNoteHttpController } from './infrastructure/http/controllers/create-pack-note.http.controller';
import { CreatePackHttpController } from './infrastructure/http/controllers/create-pack.http.controller';
import { GetPackNotesHttpController } from './infrastructure/http/controllers/get-pack-notes.http.controller';
import { GetPacksHttpController } from './infrastructure/http/controllers/get-packs.http.controller';
import { UpdatePackHttpController } from './infrastructure/http/controllers/update-pack.http.controller';
import { PackNoteRepository } from './infrastructure/persistence/pack-note.repository';
import { PackRepository } from './infrastructure/persistence/pack.repository';
import { PACK_NOTE_REPOSITORY, PACK_REPOSITORY } from './pack.di-tokens';

@Module({
  imports: [],
  controllers: [
    CreatePackHttpController,
    GetPacksHttpController,
    UpdatePackHttpController,
    CreatePackNoteHttpController,
    GetPackNotesHttpController,
  ],
  providers: [
    CreatePackService,
    GetPacksService,
    UpdatePackService,
    CreatePackNoteService,
    GetPackNotesService,
    { provide: PACK_REPOSITORY, useClass: PackRepository },
    { provide: PACK_NOTE_REPOSITORY, useClass: PackNoteRepository },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
  exports: [GetPacksService],
})
export class PackModule {}
