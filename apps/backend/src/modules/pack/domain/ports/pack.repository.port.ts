import { UUID } from '@libs/ddd/uuid.value-object';

import { PackEntity } from '../pack.entity';

export interface PackRepositoryPort {
  create(user: PackEntity): Promise<void>;
  findAll(): Promise<PackEntity[]>;
  findById(id: UUID): Promise<PackEntity | null>;
  update(pack: PackEntity): Promise<void>;
}
