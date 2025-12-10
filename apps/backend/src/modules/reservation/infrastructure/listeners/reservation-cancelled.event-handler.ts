import { ReservationCancelledDomainEvent } from '@modules/reservation/domain/events/reservation-cancelled.domain-event';
import { ReservationNotificationPort } from '@modules/reservation/domain/ports/reservation-notification.port';
import { RESERVATION_WISH_NOTIFICATION_PORT } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(ReservationCancelledDomainEvent)
export class ReservationCancelledEventHandler
  implements IEventHandler<ReservationCancelledDomainEvent>
{
  private readonly logger = new Logger(ReservationCancelledEventHandler.name);
  constructor(
    @Inject(RESERVATION_WISH_NOTIFICATION_PORT)
    private readonly notificationPort: ReservationNotificationPort,
  ) {}

  async handle({ aggregateId, id, metadata }: ReservationCancelledDomainEvent): Promise<void> {
    try {
      this.logger.log({
        message: `${ReservationCancelledDomainEvent.name} received`,
        eventId: id.uuid,
        aggregateId: aggregateId.uuid,
        metadata,
      });

      this.logger.log(`Sending refusal notification for reservation ${aggregateId.uuid}`);
      await this.notificationPort.notifyReservationCancelled(aggregateId);
    } catch (error) {
      this.logger.error(
        `Error in ReservationCancelledEventHandler: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
