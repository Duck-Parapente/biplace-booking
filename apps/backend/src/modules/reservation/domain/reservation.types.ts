import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

interface BaseReservationWishProps {
  packChoices: UUID[];
  publicComment?: string;
  createdById: UUID;
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

interface BaseReservationProps {
  packId: UUID;
  userId: UUID;
  startingDate: DateValueObject;
  endingDate: DateValueObject;
  publicComment?: string;
  reservationWishId?: UUID;
}

export type CreateReservationProps = BaseReservationProps;

export type ReservationProps = BaseReservationProps;
