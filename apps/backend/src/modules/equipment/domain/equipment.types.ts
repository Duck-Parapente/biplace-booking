import { UUID } from '@libs/ddd/uuid.value-object';

export interface EquipmentProps {
  label: string;
  order: number;
  currentHolderId: UUID | null;
  currentHolderName?: string | null;
}
