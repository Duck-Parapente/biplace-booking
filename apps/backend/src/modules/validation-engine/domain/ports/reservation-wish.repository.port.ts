import { DateValueObject } from '@libs/ddd/date.value-object';
import { ReservationWishSummary } from '../validation-engine.types';
import { UUID } from '@libs/ddd/uuid.value-object';

export interface ReservationWishRepositoryPort {
  findPendingByDate(date: DateValueObject): Promise<ReservationWishSummary[]>;
  confirmReservation(reservationWishId: UUID): Promise<void>;
}

