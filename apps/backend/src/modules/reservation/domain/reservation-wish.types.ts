import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationWishEntity } from './reservation-wish.entity';
import { ReservationEntity } from './reservation.entity';
import { ReservationStatus } from './reservation.types';

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
  reservationWish: {
    entity: ReservationWishEntity;
    events: { status: ReservationWishStatus; date: DateValueObject }[];
  };
  reservation: {
    entity: ReservationEntity;
    events: { status: ReservationStatus | undefined; date: DateValueObject; cost: Integer }[];
  } | null;
};
