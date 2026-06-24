import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { Module } from '@nestjs/common';

import { CreateEquipmentNoteService } from './application/commands/create-equipment-note/create-equipment-note.service';
import { SetEquipmentHolderService } from './application/commands/set-equipment-holder/set-equipment-holder.service';
import { UpdateEquipmentNoteService } from './application/commands/update-equipment-note/update-equipment-note.service';
import { GetEquipmentNotesService } from './application/queries/get-equipment-notes/get-equipment-notes.service';
import { GetEquipmentsService } from './application/queries/get-equipments/get-equipments.service';
import { EQUIPMENT_NOTE_REPOSITORY, EQUIPMENT_REPOSITORY } from './equipment.di-tokens';
import { CreateEquipmentNoteHttpController } from './infrastructure/http/controllers/create-equipment-note.http.controller';
import { GetEquipmentNotesHttpController } from './infrastructure/http/controllers/get-equipment-notes.http.controller';
import { GetEquipmentsHttpController } from './infrastructure/http/controllers/get-equipments.http.controller';
import { SetEquipmentHolderHttpController } from './infrastructure/http/controllers/set-equipment-holder.http.controller';
import { UpdateEquipmentNoteHttpController } from './infrastructure/http/controllers/update-equipment-note.http.controller';
import { EquipmentNoteRepository } from './infrastructure/persistence/equipment-note.repository';
import { EquipmentRepository } from './infrastructure/persistence/equipment.repository';

@Module({
  imports: [],
  controllers: [
    GetEquipmentsHttpController,
    SetEquipmentHolderHttpController,
    GetEquipmentNotesHttpController,
    CreateEquipmentNoteHttpController,
    UpdateEquipmentNoteHttpController,
  ],
  providers: [
    GetEquipmentsService,
    SetEquipmentHolderService,
    GetEquipmentNotesService,
    CreateEquipmentNoteService,
    UpdateEquipmentNoteService,
    { provide: EQUIPMENT_REPOSITORY, useClass: EquipmentRepository },
    { provide: EQUIPMENT_NOTE_REPOSITORY, useClass: EquipmentNoteRepository },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
})
export class EquipmentModule {}
