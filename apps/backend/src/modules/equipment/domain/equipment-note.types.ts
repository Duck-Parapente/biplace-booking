import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export interface EquipmentNoteProfile {
  equipmentId: UUID;
  content: string;
  createdById: UUID;
}

export type EquipmentNoteProps = EquipmentNoteProfile;
export type CreateEquipmentNoteProps = EquipmentNoteProfile & {
  createdAt: DateValueObject;
};

export type UpdateEquipmentNoteProps = Pick<EquipmentNoteProfile, 'content'>;
