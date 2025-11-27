import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationEntity } from '../reservation.entity';
import { PlanningData } from '../reservation.types';

export interface ReservationRepositoryPort {
  create(reservationEntity: ReservationEntity): Promise<void>;
  existsByPackAndDate(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<boolean>;
  findPlanningData(startDate: DateValueObject, endDate: DateValueObject): Promise<PlanningData[]>;
}
