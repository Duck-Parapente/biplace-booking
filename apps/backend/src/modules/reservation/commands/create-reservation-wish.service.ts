import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { ReservationWishDomainService } from '../domain/reservation-wish.domain-service';
import { ReservationWishEntity } from '../domain/reservation-wish.entity';
import { RESERVATION_WISH_REPOSITORY } from '../reservation.di-tokens';

import { CreateReservationWishCommand } from './create-reservation-wish.command';

@CommandHandler(CreateReservationWishCommand)
export class CreateReservationWishService
  implements ICommandHandler<CreateReservationWishCommand, void>
{
  private readonly logger = new Logger(CreateReservationWishService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
    private readonly domainService: ReservationWishDomainService,
  ) {}

  async execute({ reservationWish }: CreateReservationWishCommand): Promise<void> {
    await this.domainService.validateCreateReservationWish(reservationWish);

    const entity = ReservationWishEntity.create(reservationWish);

    await this.reservationWishRepository.create(entity);
  }
}
