import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationWishEntity } from '../reservation-wish.entity';

export interface ReservationWishRepositoryPort {
  create(user: ReservationWishEntity): Promise<void>;
  existsPendingForStartingDateAndUser(
    startingDate: DateValueObject,
    userId: UUID,
  ): Promise<boolean>;
}
