import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { ReservationWishWithReservation } from '../domain/reservation-wish.types';
import { RESERVATION_WISH_REPOSITORY } from '../reservation.di-tokens';

@Injectable()
export class GetReservationWishesService {
  private readonly logger = new Logger(GetReservationWishesService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    protected readonly reservationWishRepository: ReservationWishRepositoryPort,
  ) {}

  async execute(userId: UUID): Promise<ReservationWishWithReservation[]> {
    return this.reservationWishRepository.findAllForUser(userId);
  }

  async findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishForAttribution[]> {
    return this.reservationWishRepository.findPendingAndRefusedByStartingDate(startingDate);
  }
}
