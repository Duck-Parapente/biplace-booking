import { ReservationClosedDomainEvent } from '@modules/reservation/domain/events/reservation-closed.domain-event';
import { ReservationNotificationPort } from '@modules/reservation/domain/ports/reservation-notification.port';
import { RESERVATION_NOTIFICATION_PORT } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(ReservationClosedDomainEvent)
export class ReservationClosedEventHandler implements IEventHandler<ReservationClosedDomainEvent> {
  private readonly logger = new Logger(ReservationClosedEventHandler.name);

  constructor(
    @Inject(RESERVATION_NOTIFICATION_PORT)
    private readonly notificationPort: ReservationNotificationPort,
  ) {}

  async handle({
    id,
    userId,
    flightLog,
    aggregateId,
    metadata,
  }: ReservationClosedDomainEvent): Promise<void> {
    try {
      this.logger.log({
        message: `${ReservationClosedDomainEvent.name} received`,
        userId,
        flightLog,
        eventId: id.uuid,
        aggregateId: aggregateId.uuid,
        metadata: metadata,
      });

      this.logger.log(`Sending close notification for reservation ${aggregateId.uuid}`);
      await this.notificationPort.notifyReservationClosed(aggregateId, flightLog);
    } catch (error) {
      this.logger.error(
        `Error in ReservationClosedEventHandler: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
