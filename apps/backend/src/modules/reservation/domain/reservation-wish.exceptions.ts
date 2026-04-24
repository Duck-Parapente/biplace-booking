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
    this.label = `Tu as déjà une demande de réservation le ${startingDate.formatDDMMYY()}.`;
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
    this.label = 'Impossible de modifier le statut de cette demande de réservation.';
  }
}

export class ReservationWishNotFoundException extends ExceptionBase {
  code = ReservationWishNotFoundException.name;

  constructor(reservationWishId: UUID) {
    super(`Reservation wish with ID ${reservationWishId.uuid} not found.`);
    this.label = 'Demande de réservation introuvable.';
  }
}

export class ReservationWishInvalidDateRangeException extends ExceptionBase {
  code = ReservationWishInvalidDateRangeException.name;

  constructor(startingDate: DateValueObject, endingDate: DateValueObject) {
    super(
      `Invalid date range: starting date ${startingDate.value.toISOString()} is not before ending date ${endingDate.value.toISOString()}.`,
    );
    this.label = `Plage de dates invalide : la date de début ${startingDate.formatDDMMYY()} doit être antérieure à la date de fin ${endingDate.formatDDMMYY()}.`;
  }
}

export class EmptyPackChoicesException extends ExceptionBase {
  code = EmptyPackChoicesException.name;

  constructor() {
    super('Reservation wish must have at least one pack choice.');
    this.label = 'La demande de réservation doit contenir au moins un biplace.';
  }
}
