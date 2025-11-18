import { Inject, Injectable, Logger } from '@nestjs/common';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { ReservationWishEntity } from '../domain/reservation-wish.entity';
import { RESERVATION_WISH_REPOSITORY } from '../reservation.di-tokens';

@Injectable()
export class GetReservationWishesService {
  private readonly logger = new Logger(GetReservationWishesService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    protected readonly reservationWishRepository: ReservationWishRepositoryPort,
  ) {}

  async execute(): Promise<ReservationWishEntity[]> {
    return this.reservationWishRepository.findAll();
  }
}
