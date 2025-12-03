import { UUID } from '@libs/ddd/uuid.value-object';

export interface ReservationWishNotificationPort {
  notifyConfirmation(reservationWishId: UUID): Promise<void>;
  notifyRefusal(reservationWishId: UUID): Promise<void>;
  notifyCancel(reservationWishId: UUID): Promise<void>;
}
