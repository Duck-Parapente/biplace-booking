import { DomainEventMetadata } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import { ReservationWishNotFoundError } from '@modules/reservation/domain/reservation-wish.exceptions';
import { ReservationWishStatus } from '@modules/reservation/domain/reservation-wish.types';
import { RESERVATION_WISH_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateReservationWishCommand } from './update-reservation-wish.command';

@CommandHandler(UpdateReservationWishCommand)
export class UpdateReservationWishService
  implements ICommandHandler<UpdateReservationWishCommand, void>
{
  private readonly logger = new Logger(UpdateReservationWishService.name);

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
  ) {}

  async execute({
    reservationWishId,
    status,
    metadata,
  }: UpdateReservationWishCommand): Promise<void> {
    await this.updateReservationWishStatus(reservationWishId, status, metadata);
  }

  async cancelReservationWish(
    reservationWishId: UUID,
    metadata: DomainEventMetadata,
  ): Promise<void> {
    await this.updateReservationWishStatus(
      reservationWishId,
      ReservationWishStatus.CANCELLED,
      metadata,
    );
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
  ): Promise<void> {
    const entity = await this.reservationWishRepository.findById(reservationWishId);

    if (!entity) {
      throw new ReservationWishNotFoundError(reservationWishId);
    }

    if (entity.status === status) {
      this.logger.log(
        `ReservationWish ${reservationWishId.uuid} already in status ${status}, no update needed`,
      );
      return;
    }

    entity.update(status, metadata);
    await this.reservationWishRepository.updateStatus(entity);

    this.logger.log(`ReservationWish ${reservationWishId.uuid} updated to ${status}`);
  }
}
