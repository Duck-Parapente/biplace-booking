import { DomainEventMetadata } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { ReservationWishDomainService } from '../domain/reservation-wish.domain-service';
import { ReservationWishNotFoundError } from '../domain/reservation.exceptions';
import { ReservationWishStatus } from '../domain/reservation.types';
import { RESERVATION_WISH_REPOSITORY } from '../reservation.di-tokens';

import { UpdateReservationWishCommand } from './update-reservation-wish.command';

@CommandHandler(UpdateReservationWishCommand)
export class UpdateReservationWishService
  implements ICommandHandler<UpdateReservationWishCommand, void>
{
  private readonly logger = new Logger(UpdateReservationWishService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
    private readonly domainService: ReservationWishDomainService,
  ) {}

  async execute({
    reservationWishId,
    userId,
    status,
    metadata,
  }: UpdateReservationWishCommand): Promise<void> {
    await this.updateReservationWishStatus(reservationWishId, status, metadata, userId);
  }

  async confirmReservationWish(
    reservationWishId: UUID,
    metadata: DomainEventMetadata,
  ): Promise<void> {
    await this.updateReservationWishStatus(
      reservationWishId,
      ReservationWishStatus.CONFIRMED,
      metadata,
    );
  }

  async refuseReservationWish(
    reservationWishId: UUID,
    metadata: DomainEventMetadata,
  ): Promise<void> {
    await this.updateReservationWishStatus(
      reservationWishId,
      ReservationWishStatus.REFUSED,
      metadata,
    );
  }

  private async updateReservationWishStatus(
    reservationWishId: UUID,
    status: ReservationWishStatus,
    metadata: DomainEventMetadata,
    userId?: UUID,
  ): Promise<void> {
    const entity = await this.reservationWishRepository.findById(reservationWishId);

    if (!entity) {
      throw new ReservationWishNotFoundError(reservationWishId);
    }

    if (userId) {
      await this.domainService.validateUserCanUpdateReservationWish(entity, userId);
    }

    entity.update(status, metadata);

    await this.reservationWishRepository.updateStatus(entity);

    this.logger.log(`ReservationWish ${reservationWishId.uuid} updated to ${status}`);
  }
}
