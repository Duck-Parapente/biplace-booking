import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ExceptionBase } from '@libs/exceptions';

import { ReservationWishStatus } from './reservation-wish.types';

export class UserHasReservationWishOnStartingDateException extends ExceptionBase {
  code = UserHasReservationWishOnStartingDateException.name;
  constructor(userId: UUID, startingDate: DateValueObject) {
    super(
      `User with ID ${userId.uuid} already has a reservation wish on starting date ${startingDate.value.toISOString()}.`,
    );
  }
}

export class CannotUpdateReservationWishStatusException extends ExceptionBase {
  code = CannotUpdateReservationWishStatusException.name;
  constructor(
    reservationWishId: UUID,
    previousStatus: ReservationWishStatus,
    newStatus: ReservationWishStatus,
  ) {
    super(
      `Cannot update reservation wish with ID ${reservationWishId.uuid} from status ${previousStatus} to ${newStatus}.`,
    );
  }
}

export class ReservationWishNotFoundException extends ExceptionBase {
  code = ReservationWishNotFoundException.name;

  constructor(reservationWishId: UUID) {
    super(`Reservation wish with ID ${reservationWishId.uuid} not found.`);
  }
}

export class ReservationWishInvalidDateRangeException extends ExceptionBase {
  code = ReservationWishInvalidDateRangeException.name;

  constructor(startingDate: DateValueObject, endingDate: DateValueObject) {
    super(
      `Invalid date range: starting date ${startingDate.value.toISOString()} is not before ending date ${endingDate.value.toISOString()}.`,
    );
  }
}

export class EmptyPackChoicesException extends ExceptionBase {
  code = EmptyPackChoicesException.name;

  constructor() {
    super('Reservation wish must have at least one pack choice.');
  }
}

export class CannotCreateReservationWishException extends ExceptionBase {
  code = CannotCreateReservationWishException.name;

  constructor(packId: UUID, startingDate: DateValueObject) {
    super(
      `Cannot create reservation wish for pack ID ${packId.uuid} on starting date ${startingDate.value.toISOString()}.`,
    );
  }
}
