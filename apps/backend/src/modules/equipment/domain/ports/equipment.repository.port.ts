import { UUID } from '@libs/ddd/uuid.value-object';

import { EquipmentEntity } from '../equipment.entity';

export interface EquipmentRepositoryPort {
  findAll(): Promise<EquipmentEntity[]>;
  findById(id: UUID): Promise<EquipmentEntity | null>;
  update(equipment: EquipmentEntity): Promise<void>;
}
