import { UUID } from '@libs/ddd/uuid.value-object';

import { FlightLogProps } from '../reservation.types';

export interface ReservationNotificationPort {
  notifyReservationCreated(
    reservationId: UUID,
    explanationTable: string,
    userId?: UUID,
  ): Promise<void>;
  notifyReservationCancelled(reservationId: UUID, userId?: UUID): Promise<void>;
  notifyReservationClosed(
    reservationId: UUID,
    flightLog: FlightLogProps,
    packNote?: string,
  ): Promise<void>;
}
