import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import { ReservationWishWithHistory } from '@modules/reservation/domain/reservation-wish.read-models';
import { RESERVATION_WISH_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetReservationWishesService {
  private readonly logger = new Logger(GetReservationWishesService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
  ) {}

  async execute(userId: UUID): Promise<ReservationWishWithHistory[]> {
    return this.reservationWishRepository.findAllWithHistoryForUser(userId);
  }

  async findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishForAttribution[]> {
    return this.reservationWishRepository.findPendingAndRefusedByStartingDate(startingDate);
  }
}
