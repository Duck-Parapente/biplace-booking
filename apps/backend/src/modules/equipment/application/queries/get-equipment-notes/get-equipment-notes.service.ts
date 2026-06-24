import { UUID } from '@libs/ddd/uuid.value-object';
import { EquipmentNoteEntity } from '@modules/equipment/domain/equipment-note.entity';
import { EquipmentNoteRepositoryPort } from '@modules/equipment/domain/ports/equipment-note.repository.port';
import { EQUIPMENT_NOTE_REPOSITORY } from '@modules/equipment/equipment.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetEquipmentNotesService {
  private readonly logger = new Logger(GetEquipmentNotesService.name);

  constructor(
    @Inject(EQUIPMENT_NOTE_REPOSITORY)
    private readonly equipmentNoteRepository: EquipmentNoteRepositoryPort,
  ) {}

  async execute(equipmentId: UUID): Promise<EquipmentNoteEntity[]> {
    return this.equipmentNoteRepository.findByEquipmentId(equipmentId);
  }
}
