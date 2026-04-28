import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export interface PackNoteProfile {
  packId: UUID;
  content: string;
  createdById: UUID;
}

export type PackNoteProps = PackNoteProfile;
export type CreatePackNoteProps = PackNoteProfile & {
  createdAt: DateValueObject;
};

export type UpdatePackNoteProps = Pick<PackNoteProfile, 'content'>;
