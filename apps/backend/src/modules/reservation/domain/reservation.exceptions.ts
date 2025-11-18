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

export class CannotCancelConfirmedReservationWishError extends Error {
  constructor(reservationWishId: UUID) {
    super(
      `Cannot cancel reservation wish with ID ${reservationWishId.uuid} because it is already confirmed.`,
    );
    this.name = CannotCancelConfirmedReservationWishError.name;
  }
}

export class ReservationWishNotFoundError extends Error {
  constructor(reservationWishId: UUID) {
    super(`Reservation wish with ID ${reservationWishId.uuid} not found.`);
    this.name = ReservationWishNotFoundError.name;
  }
}
