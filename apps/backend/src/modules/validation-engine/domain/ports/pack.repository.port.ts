import { DateValueObject } from '@libs/ddd/date.value-object';
import { PackSummary } from '@libs/types/accross-modules';

export interface PackRepositoryPort {
  findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]>;
}
