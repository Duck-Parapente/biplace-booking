import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishSummary } from '@libs/types/accross-modules';
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

  async execute(userId: UUID): Promise<ReservationWishEntity[]> {
    return this.reservationWishRepository.findAllForUser(userId);
  }

  async findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishSummary[]> {
    return this.reservationWishRepository.findPendingAndRefusedByStartingDate(startingDate);
  }
}
