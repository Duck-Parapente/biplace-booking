import { ReservationWishNotificationProps } from '../reservation.types';

export interface ReservationWishNotificationPort {
  notifyConfirmation(payload: ReservationWishNotificationProps): Promise<void>;
  notifyRefusal(payload: ReservationWishNotificationProps): Promise<void>;
}
