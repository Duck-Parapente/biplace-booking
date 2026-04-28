import { PackNoteEntity } from '@modules/pack/domain/pack-note.entity';
import { PackNoteDto } from 'shared';

export function mapPackNoteToDto(packNote: PackNoteEntity): PackNoteDto {
  return {
    id: packNote.id.uuid,
    packId: packNote.packId.uuid,
    content: packNote.content,
    createdAt: packNote.createdAt.value.toISOString(),
    createdById: packNote.createdById.uuid,
  };
}
