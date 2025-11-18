import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { ReservationWishEntity } from '../domain/reservation-wish.entity';
import { UserHasReservationWishOnStartingDateError } from '../domain/reservation.exceptions';
import { RESERVATION_WISH_REPOSITORY } from '../reservation.di-tokens';

import { CreateReservationWishCommand } from './create-reservation-wish.command';

@CommandHandler(CreateReservationWishCommand)
export class CreateReservationWishService
  implements ICommandHandler<CreateReservationWishCommand, void>
{
  private readonly logger = new Logger(CreateReservationWishService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    protected readonly reservationWishRepository: ReservationWishRepositoryPort,
  ) {}

  async execute({ reservationWish }: CreateReservationWishCommand): Promise<void> {
    const hasExistingWishOnStartingDate =
      await this.reservationWishRepository.existsByStartingDateAndUserId(
        reservationWish.startingDate,
        reservationWish.createdById,
      );

    if (hasExistingWishOnStartingDate) {
      throw new UserHasReservationWishOnStartingDateError(
        reservationWish.createdById,
        reservationWish.startingDate,
      );
    }

    const entity = ReservationWishEntity.create(reservationWish);

    await this.reservationWishRepository.create(entity);
  }
}
