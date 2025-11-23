import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishSummary } from '@libs/types/accross-modules';

export interface ReservationWishRepositoryPort {
  findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishSummary[]>;
  confirmReservationWish(reservationWishId: UUID): Promise<void>;
  refuseReservationWish(reservationWishId: UUID): Promise<void>;
}
