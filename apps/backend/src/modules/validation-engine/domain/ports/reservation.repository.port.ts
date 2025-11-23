import { DateValueObject } from '@libs/ddd/date.value-object';
import { ReservationWishSummary } from '../validation-engine.types';
import { UUID } from '@libs/ddd/uuid.value-object';

export interface ReservationRepositoryPort {
  findByPackAndDate(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<ReservationWishSummary | null>;

  create(props: {
    packId: UUID;
    userId: UUID;
    startingDate: DateValueObject;
    endingDate: DateValueObject;
    reservationWishId: UUID;
    publicComment: string;
  }): Promise<void>;
}
