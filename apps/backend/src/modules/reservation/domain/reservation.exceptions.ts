import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export class UserHasReservationWishOnStartingDateError extends Error {
  constructor(userId: UUID, startingDate: DateValueObject) {
    super(
      `User with ID ${userId.uuid} already has a reservation wish on starting date ${startingDate.value.toISOString()}.`,
    );
    this.name = UserHasReservationWishOnStartingDateError.name;
  }
}
