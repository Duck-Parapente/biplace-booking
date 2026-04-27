import { UUID } from '@libs/ddd/uuid.value-object';

export interface PackNoteProfile {
  packId: UUID;
  content: string;
  createdById: UUID;
}

export type PackNoteProps = PackNoteProfile & {
  createdByName: string;
};

export type CreatePackNoteProps = PackNoteProfile;
