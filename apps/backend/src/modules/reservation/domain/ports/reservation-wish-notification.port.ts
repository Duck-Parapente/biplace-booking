import { UUID } from '@libs/ddd/uuid.value-object';

export interface ReservationWishNotificationPort {
  notifyWishRefusal(reservationWishId: UUID, explanationTable?: string): Promise<void>;
  notifyWishCancel(reservationWishId: UUID): Promise<void>;
}
