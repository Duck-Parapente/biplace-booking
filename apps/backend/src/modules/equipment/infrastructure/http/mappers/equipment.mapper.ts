import { EquipmentEntity } from '@modules/equipment/domain/equipment.entity';
import { EquipmentDto } from 'shared';

export function mapEquipmentToDto(equipment: EquipmentEntity): EquipmentDto {
  return {
    id: equipment.id.uuid,
    label: equipment.label,
    order: equipment.order,
    currentHolderId: equipment.currentHolderId?.uuid ?? null,
    currentHolderName: equipment.currentHolderName,
  };
}
