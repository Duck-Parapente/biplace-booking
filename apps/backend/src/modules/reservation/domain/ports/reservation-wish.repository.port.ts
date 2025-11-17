import { ReservationWishEntity } from '../reservation-wish.entity';

export interface ReservationWishRepositoryPort {
  create(user: ReservationWishEntity): Promise<void>;
}
