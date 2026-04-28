import { UUID } from '@libs/ddd/uuid.value-object';

import { PackNoteEntity } from '../pack-note.entity';

export interface PackNoteRepositoryPort {
  create(packNote: PackNoteEntity): Promise<void>;
  findById(noteId: UUID): Promise<PackNoteEntity | null>;
  findByPackId(packId: UUID): Promise<PackNoteEntity[]>;
  update(packNote: PackNoteEntity): Promise<void>;
}
