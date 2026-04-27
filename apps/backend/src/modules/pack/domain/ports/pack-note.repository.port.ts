import { UUID } from '@libs/ddd/uuid.value-object';

import { PackNoteEntity } from '../pack-note.entity';

export interface PackNoteRepositoryPort {
  create(packNote: PackNoteEntity): Promise<void>;
  findByPackId(packId: UUID): Promise<PackNoteEntity[]>;
}
