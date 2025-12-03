import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ExceptionBase } from '@libs/exceptions';

export class CannotCreateReservationException extends ExceptionBase {
  code = CannotCreateReservationException.name;
  constructor(packId: UUID, startingDate: DateValueObject) {
    super(
      `Cannot create reservation for pack ID ${packId.uuid} on starting date ${startingDate.value.toISOString()}.`,
    );
  }
}

export class ReservationNotFoundException extends ExceptionBase {
  code = ReservationNotFoundException.name;
  constructor(reservationId: UUID) {
    super(`Reservation not found: ${reservationId.uuid}`);
  }
}

export class CannotCancelReservationException extends ExceptionBase {
  code = CannotCancelReservationException.name;
  constructor(reservationId: UUID, status: string) {
    super(
      `Cannot cancel reservation ${reservationId.uuid} with status ${status}. Only confirmed reservations can be cancelled.`,
    );
  }
}

export class ReservationInvalidDateRangeException extends ExceptionBase {
  code = ReservationInvalidDateRangeException.name;

  constructor(startingDate: DateValueObject, endingDate: DateValueObject) {
    super(
      `Invalid date range: starting date ${startingDate.value.toISOString()} is not before ending date ${endingDate.value.toISOString()}.`,
    );
  }
}
