import { ReservationWishStatusUpdatedDomainEvent } from '@modules/reservation/domain/events/reservation-wish-updated.domain-event';
import { ReservationWishNotificationPort } from '@modules/reservation/domain/ports/reservation-wish-notification.port';
import { RESERVATION_WISH_NOTIFICATION_PORT } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReservationWishStatus } from '@prisma/client';

@EventsHandler(ReservationWishStatusUpdatedDomainEvent)
export class ReservationWishStatusUpdatedEventHandler
  implements IEventHandler<ReservationWishStatusUpdatedDomainEvent>
{
  private readonly logger = new Logger(ReservationWishStatusUpdatedEventHandler.name);

  constructor(
    @Inject(RESERVATION_WISH_NOTIFICATION_PORT)
    private readonly notificationPort: ReservationWishNotificationPort,
  ) {}

  async handle({
    status,
    aggregateId,
    id,
    metadata,
  }: ReservationWishStatusUpdatedDomainEvent): Promise<void> {
    try {
      this.logger.log({
        message: `${ReservationWishStatusUpdatedDomainEvent.name} received`,
        status,
        eventId: id.uuid,
        aggregateId: aggregateId.uuid,
        metadata: metadata,
      });

      if (status === ReservationWishStatus.CONFIRMED) {
        this.logger.log(
          `Sending confirmation notification for reservation wish ${aggregateId.uuid}`,
        );
        await this.notificationPort.notifyConfirmation(aggregateId);
        return;
      }

      if (status === ReservationWishStatus.REFUSED) {
        this.logger.log(`Sending refusal notification for reservation wish ${aggregateId.uuid}`);
        await this.notificationPort.notifyRefusal(aggregateId);
        return;
      }

      if (status === ReservationWishStatus.CANCELLED) {
        this.logger.log(`Sending cancel notification for reservation wish ${aggregateId.uuid}`);
        await this.notificationPort.notifyCancel(aggregateId);
        return;
      }
    } catch (error) {
      this.logger.error(
        `Error in ReservationWishStatusUpdatedEventHandler: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
