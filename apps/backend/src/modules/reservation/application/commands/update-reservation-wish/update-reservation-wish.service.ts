import { DomainEventMetadata } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishNotificationPort } from '@modules/reservation/domain/ports/reservation-wish-notification.port';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import { ReservationWishDomainService } from '@modules/reservation/domain/reservation-wish.domain-service';
import { ReservationWishEntity } from '@modules/reservation/domain/reservation-wish.entity';
import { ReservationWishNotFoundError } from '@modules/reservation/domain/reservation-wish.exceptions';
import { ReservationWishStatus } from '@modules/reservation/domain/reservation-wish.types';
import {
  RESERVATION_WISH_NOTIFICATION_PORT,
  RESERVATION_WISH_REPOSITORY,
} from '@modules/reservation/reservation.di-tokens';
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
    private readonly domainService: ReservationWishDomainService,
    @Inject(RESERVATION_WISH_NOTIFICATION_PORT)
    private readonly notificationPort: ReservationWishNotificationPort,
  ) {}

  async execute({
    reservationWishId,
    status,
    metadata,
  }: UpdateReservationWishCommand): Promise<void> {
    await this.updateReservationWishStatus(reservationWishId, status, metadata);
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

    const previousStatus = entity.status;

    entity.update(status, metadata);
    await this.reservationWishRepository.updateStatus(entity);
    this.logger.log(`ReservationWish ${reservationWishId.uuid} updated to ${status}`);

    if (entity.shouldSendNewStatusNotification(previousStatus, status)) {
      await this.sendNotification(entity, status);
    }
  }

  private async sendNotification(
    { id: reservationWishId }: ReservationWishEntity,
    newStatus: ReservationWishStatus,
  ): Promise<void> {
    try {
      if (newStatus === ReservationWishStatus.CONFIRMED) {
        await this.notificationPort.notifyConfirmation(reservationWishId);
        return;
      }
      if (newStatus === ReservationWishStatus.REFUSED) {
        await this.notificationPort.notifyRefusal(reservationWishId);
        return;
      }
      this.logger.error(`Unsupported reservation wish status for notification: ${newStatus}`);
    } catch (error) {
      this.logger.error(
        `Failed to send notification for reservation wish ${reservationWishId.uuid}: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }
}
