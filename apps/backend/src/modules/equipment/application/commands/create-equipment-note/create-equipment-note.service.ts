import { EquipmentNoteEntity } from '@modules/equipment/domain/equipment-note.entity';
import { EquipmentNoteRepositoryPort } from '@modules/equipment/domain/ports/equipment-note.repository.port';
import { EQUIPMENT_NOTE_REPOSITORY } from '@modules/equipment/equipment.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateEquipmentNoteCommand } from './create-equipment-note.command';

@CommandHandler(CreateEquipmentNoteCommand)
export class CreateEquipmentNoteService
  implements ICommandHandler<CreateEquipmentNoteCommand, void>
{
  private readonly logger = new Logger(CreateEquipmentNoteService.name);

  constructor(
    @Inject(EQUIPMENT_NOTE_REPOSITORY)
    private readonly equipmentNoteRepository: EquipmentNoteRepositoryPort,
  ) {}

  async execute({ props, metadata }: CreateEquipmentNoteCommand): Promise<void> {
    const equipmentNote = EquipmentNoteEntity.create(props, metadata);
    await this.equipmentNoteRepository.create(equipmentNote);
  }
}
