import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { RESERVATION_WISH_REPOSITORY } from '../reservation.di-tokens';

import { CancelReservationWishCommand } from './cancel-reservation-wish.command';
import { ReservationWishNotFoundError } from '../domain/reservation.exceptions';

@CommandHandler(CancelReservationWishCommand)
export class CancelReservationWishService
  implements ICommandHandler<CancelReservationWishCommand, void>
{
  private readonly logger = new Logger(CancelReservationWishService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
  ) {}

  async execute({ reservationWishId }: CancelReservationWishCommand): Promise<void> {
    const entity = await this.reservationWishRepository.findById(reservationWishId);

    if (!entity) {
      throw new ReservationWishNotFoundError(reservationWishId);
    }

    entity.cancel();

    await this.reservationWishRepository.update(entity);

    this.logger.log(`ReservationWish ${reservationWishId} cancelled`);
  }
}
