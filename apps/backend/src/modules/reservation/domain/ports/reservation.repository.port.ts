import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { PackSummary } from '@libs/types/accross-modules';

import { ReservationEntity } from '../reservation.entity';
import { PlanningReservationDto } from '../reservation.types';

export interface ReservationRepositoryPort {
  create(reservationEntity: ReservationEntity): Promise<void>;
  update(reservation: ReservationEntity): Promise<void>;
  findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]>;
  existsByPackAndDate(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<boolean>;
  findConfirmedReservationsByDateRange(
    startDate: DateValueObject,
    endDate: DateValueObject,
  ): Promise<PlanningReservationDto[]>;
  findById(id: UUID): Promise<ReservationEntity | null>;
}
