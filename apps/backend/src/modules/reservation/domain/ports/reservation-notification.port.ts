import { UUID } from '@libs/ddd/uuid.value-object';

export interface ReservationNotificationPort {
  notifyWishRefusal(reservationWishId: UUID): Promise<void>;
  notifyWishCancel(reservationWishId: UUID): Promise<void>;
  notifyReservationCreated(reservationId: UUID): Promise<void>;
  notifyReservationCancelled(reservationId: UUID): Promise<void>;
}
