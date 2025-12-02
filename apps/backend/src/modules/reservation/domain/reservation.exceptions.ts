import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export class CannotCreateReservationError extends Error {
  constructor(packId: UUID, startingDate: DateValueObject) {
    super(
      `Cannot create reservation for pack ID ${packId.uuid} on starting date ${startingDate.value.toISOString()}.`,
    );
    this.name = CannotCreateReservationError.name;
  }
}

export class ReservationNotFoundError extends Error {
  constructor(reservationId: UUID) {
    super(`Reservation not found: ${reservationId.uuid}`);
    this.name = ReservationNotFoundError.name;
  }
}

export class CannotCancelReservationError extends Error {
  constructor(reservationId: UUID, status: string) {
    super(
      `Cannot cancel reservation ${reservationId.uuid} with status ${status}. Only confirmed reservations can be cancelled.`,
    );
    this.name = CannotCancelReservationError.name;
  }
}
