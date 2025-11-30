import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationWishEntity } from './reservation-wish.entity';
import { ReservationEntity } from './reservation.entity';

interface BaseReservationWishProps {
  packChoices: UUID[];
  publicComment?: string;
  userId: UUID;
}

export type CreateReservationWishProps = BaseReservationWishProps & {
  startingDate: DateValueObject;
};

export type ReservationWishProps = BaseReservationWishProps & {
  startingDate: DateValueObject;
  endingDate: DateValueObject;
  status: ReservationWishStatus;
};

export enum ReservationWishStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  REFUSED = 'REFUSED',
  CONFIRMED = 'CONFIRMED',
}

export type ReservationWishWithReservation = {
  reservationWish: ReservationWishEntity;
  reservations: ReservationEntity[];
  events: { status: ReservationWishStatus; date: DateValueObject }[];
};
