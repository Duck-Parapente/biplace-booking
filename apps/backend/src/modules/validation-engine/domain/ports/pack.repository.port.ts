import { DateValueObject } from '@libs/ddd/date.value-object';
import { PackSummary } from '../validation-engine.types';

export interface PackRepositoryPort {
  findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]>;
}
