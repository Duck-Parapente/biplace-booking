import { ReservationWishNotificationProps } from '../reservation-wish.types';

export interface ReservationWishNotificationPort {
  notifyConfirmation(payload: ReservationWishNotificationProps): Promise<void>;
  notifyRefusal(payload: ReservationWishNotificationProps): Promise<void>;
}
