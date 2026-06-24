import { EquipmentNoteEntity } from '@modules/equipment/domain/equipment-note.entity';
import { EquipmentNoteDto } from 'shared';

export function mapEquipmentNoteToDto(equipmentNote: EquipmentNoteEntity): EquipmentNoteDto {
  return {
    id: equipmentNote.id.uuid,
    equipmentId: equipmentNote.equipmentId.uuid,
    content: equipmentNote.content,
    createdAt: equipmentNote.createdAt.value.toISOString(),
    createdById: equipmentNote.createdById.uuid,
  };
}
