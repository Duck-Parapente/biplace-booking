import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationWishEntity } from '../reservation-wish.entity';

export interface ReservationWishRepositoryPort {
  create(reservationWishEntity: ReservationWishEntity): Promise<void>;
  existsPendingForStartingDateAndUser(
    startingDate: DateValueObject,
    userId: UUID,
  ): Promise<boolean>;
  findById(reservationWishId: UUID): Promise<ReservationWishEntity | null>;
  update(reservationWish: ReservationWishEntity): Promise<void>;
  findAllForUser(userId: UUID): Promise<ReservationWishEntity[]>;
}
