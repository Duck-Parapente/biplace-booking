import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import { ReservationWishDomainService } from '@modules/reservation/domain/reservation-wish.domain-service';
import { ReservationWishEntity } from '@modules/reservation/domain/reservation-wish.entity';
import { RESERVATION_WISH_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateReservationWishCommand } from './create-reservation-wish.command';

@CommandHandler(CreateReservationWishCommand)
export class CreateReservationWishService
  implements ICommandHandler<CreateReservationWishCommand, UUID>
{
  private readonly logger = new Logger(CreateReservationWishService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
    private readonly domainService: ReservationWishDomainService,
  ) {}

  async execute({ reservationWish, metadata }: CreateReservationWishCommand): Promise<UUID> {
    await this.domainService.validateCreateReservationWish(reservationWish);

    const entity = ReservationWishEntity.create(reservationWish, metadata);

    await this.reservationWishRepository.create(entity);

    return entity.id;
  }
}
