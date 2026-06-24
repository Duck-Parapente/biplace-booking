import { UUID } from '@libs/ddd/uuid.value-object';

import { EquipmentNoteEntity } from '../equipment-note.entity';

export interface EquipmentNoteRepositoryPort {
  create(equipmentNote: EquipmentNoteEntity): Promise<void>;
  findById(noteId: UUID): Promise<EquipmentNoteEntity | null>;
  findByEquipmentId(equipmentId: UUID): Promise<EquipmentNoteEntity[]>;
  update(equipmentNote: EquipmentNoteEntity): Promise<void>;
}
