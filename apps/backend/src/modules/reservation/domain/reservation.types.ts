import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

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
