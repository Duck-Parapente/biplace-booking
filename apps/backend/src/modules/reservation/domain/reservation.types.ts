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
};
