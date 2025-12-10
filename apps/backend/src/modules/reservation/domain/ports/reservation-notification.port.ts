import { UUID } from '@libs/ddd/uuid.value-object';

import { FlightLogProps } from '../reservation.types';

export interface ReservationNotificationPort {
  notifyWishRefusal(reservationWishId: UUID, explanationTable?: string): Promise<void>;
  notifyWishCancel(reservationWishId: UUID, explanationTable?: string): Promise<void>;
  notifyReservationCreated(reservationId: UUID, userId?: UUID): Promise<void>;
  notifyReservationCancelled(reservationId: UUID, userId?: UUID): Promise<void>;
  notifyReservationClosed(reservationId: UUID, flightLog: FlightLogProps): Promise<void>;
}
