import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationWishStatus } from './reservation.types';

export class UserHasReservationWishOnStartingDateError extends Error {
  constructor(userId: UUID, startingDate: DateValueObject) {
    super(
      `User with ID ${userId.uuid} already has a reservation wish on starting date ${startingDate.value.toISOString()}.`,
    );
    this.name = UserHasReservationWishOnStartingDateError.name;
  }
}

export class CannotUpdateReservationWishStatusError extends Error {
  constructor(
    reservationWishId: UUID,
    previousStatus: ReservationWishStatus,
    newStatus: ReservationWishStatus,
  ) {
    super(
      `Cannot up reservation wish with ID ${reservationWishId.uuid} from status ${previousStatus} to ${newStatus}.`,
    );
    this.name = CannotUpdateReservationWishStatusError.name;
  }
}

export class ReservationWishNotFoundError extends Error {
  constructor(reservationWishId: UUID) {
    super(`Reservation wish with ID ${reservationWishId.uuid} not found.`);
    this.name = ReservationWishNotFoundError.name;
  }
}

export class UnauthorizedToCancelReservationWishError extends Error {
  constructor(userId: UUID, reservationWishId: UUID) {
    super(
      `User with ID ${userId.uuid} is not authorized to cancel reservation wish with ID ${reservationWishId.uuid}.`,
    );
    this.name = UnauthorizedToCancelReservationWishError.name;
  }
}
