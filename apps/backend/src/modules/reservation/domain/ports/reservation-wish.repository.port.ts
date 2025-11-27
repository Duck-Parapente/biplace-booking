import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';

import { ReservationWishEntity } from '../reservation-wish.entity';
import { ReservationWishWithReservation } from '../reservation-wish.types';

export interface ReservationWishRepositoryPort {
  create(reservationWishEntity: ReservationWishEntity): Promise<void>;
  existsNotCancelledForStartingDateAndUser(
    startingDate: DateValueObject,
    userId: UUID,
  ): Promise<boolean>;
  findById(reservationWishId: UUID): Promise<ReservationWishEntity | null>;
  updateStatus(reservationWish: ReservationWishEntity): Promise<void>;
  findAllForUser(userId: UUID): Promise<ReservationWishWithReservation[]>;
  findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishForAttribution[]>;
}
