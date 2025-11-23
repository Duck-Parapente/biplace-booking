import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishSummary } from '@libs/types/accross-modules';
import { GetReservationWishesService } from '@modules/reservation/commands/get-reservation-wishes.service';
import { UpdateReservationWishService } from '@modules/reservation/commands/update-reservation-wish.service';
import { Injectable, Logger } from '@nestjs/common';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';

@Injectable()
export class ReservationWishRepository implements ReservationWishRepositoryPort {
  private readonly logger = new Logger(ReservationWishRepository.name);

  constructor(
    readonly updateReservationWishService: UpdateReservationWishService,
    readonly getReservationWishesService: GetReservationWishesService,
  ) {}

  async findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishSummary[]> {
    return this.getReservationWishesService.findPendingAndRefusedByStartingDate(startingDate);
  }

  async confirmReservationWish(reservationWishId: UUID): Promise<void> {
    await this.updateReservationWishService.confirmReservationWish(reservationWishId);
  }

  async refuseReservationWish(reservationWishId: UUID): Promise<void> {
    await this.updateReservationWishService.refuseReservationWish(reservationWishId);
  }
}
