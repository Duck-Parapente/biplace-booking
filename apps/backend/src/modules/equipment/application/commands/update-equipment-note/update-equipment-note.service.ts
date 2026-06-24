import { EquipmentNoteRepositoryPort } from '@modules/equipment/domain/ports/equipment-note.repository.port';
import { EQUIPMENT_NOTE_REPOSITORY } from '@modules/equipment/equipment.di-tokens';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateEquipmentNoteCommand } from './update-equipment-note.command';

@CommandHandler(UpdateEquipmentNoteCommand)
export class UpdateEquipmentNoteService
  implements ICommandHandler<UpdateEquipmentNoteCommand, void>
{
  private readonly logger = new Logger(UpdateEquipmentNoteService.name);

  constructor(
    @Inject(EQUIPMENT_NOTE_REPOSITORY)
    private readonly equipmentNoteRepository: EquipmentNoteRepositoryPort,
  ) {}

  async execute({ noteId, updates }: UpdateEquipmentNoteCommand): Promise<void> {
    const equipmentNote = await this.equipmentNoteRepository.findById(noteId);
    if (!equipmentNote) {
      throw new NotFoundException({ message: `EquipmentNote ${noteId.uuid} not found` });
    }

    equipmentNote.update(updates);
    await this.equipmentNoteRepository.update(equipmentNote);
  }
}
