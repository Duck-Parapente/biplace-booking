import { ReservationCreatedDomainEvent } from '@modules/reservation/domain/events/reservation-created.domain-event';
import { ReservationNotificationPort } from '@modules/reservation/domain/ports/reservation-notification.port';
import { RESERVATION_WISH_NOTIFICATION_PORT } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(ReservationCreatedDomainEvent)
export class ReservationCreatedEventHandler
  implements IEventHandler<ReservationCreatedDomainEvent>
{
  private readonly logger = new Logger(ReservationCreatedEventHandler.name);

  constructor(
    @Inject(RESERVATION_WISH_NOTIFICATION_PORT)
    private readonly notificationPort: ReservationNotificationPort,
  ) {}

  async handle({
    id,
    reservation,
    aggregateId,
    metadata,
  }: ReservationCreatedDomainEvent): Promise<void> {
    try {
      this.logger.log({
        message: `${ReservationCreatedDomainEvent.name} received`,
        reservation,
        eventId: id.uuid,
        aggregateId: aggregateId.uuid,
        metadata: metadata,
      });

      this.logger.log(`Sending confirmation notification for reservation ${aggregateId.uuid}`);
      await this.notificationPort.notifyReservationCreated(aggregateId);
    } catch (error) {
      this.logger.error(
        `Error in ReservationCreatedEventHandler: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
