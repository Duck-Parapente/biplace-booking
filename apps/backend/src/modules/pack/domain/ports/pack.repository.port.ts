import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { PackSummary } from '@libs/types/accross-modules';

import { PackEntity } from '../pack.entity';

export interface PackRepositoryPort {
  create(user: PackEntity): Promise<void>;
  findAll(): Promise<PackEntity[]>;
  findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]>;
  findById(id: UUID): Promise<PackEntity | null>;
  update(pack: PackEntity): Promise<void>;
  isPackOwnedByUser(packId: UUID, userId: UUID): Promise<boolean>;
}
