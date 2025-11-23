import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishSummary } from '@libs/types/accross-modules';

import { ReservationWishEntity } from '../reservation-wish.entity';

export interface ReservationWishRepositoryPort {
  create(reservationWishEntity: ReservationWishEntity): Promise<void>;
  existsPendingForStartingDateAndUser(
    startingDate: DateValueObject,
    userId: UUID,
  ): Promise<boolean>;
  findById(reservationWishId: UUID): Promise<ReservationWishEntity | null>;
  updateStatus(reservationWish: ReservationWishEntity): Promise<void>;
  findAllForUser(userId: UUID): Promise<ReservationWishEntity[]>;
  findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishSummary[]>;
}
