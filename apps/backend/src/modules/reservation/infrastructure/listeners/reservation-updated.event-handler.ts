import { ReservationUpdatedDomainEvent } from '@modules/reservation/domain/events/reservation-updated.domain-event';
import { ReservationNotificationPort } from '@modules/reservation/domain/ports/reservation-notification.port';
import { ReservationStatus } from '@modules/reservation/domain/reservation.types';
import { RESERVATION_WISH_NOTIFICATION_PORT } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(ReservationUpdatedDomainEvent)
export class ReservationUpdatedEventHandler
  implements IEventHandler<ReservationUpdatedDomainEvent>
{
  private readonly logger = new Logger(ReservationUpdatedEventHandler.name);
  constructor(
    @Inject(RESERVATION_WISH_NOTIFICATION_PORT)
    private readonly notificationPort: ReservationNotificationPort,
  ) {}

  async handle({
    status,
    aggregateId,
    id,
    metadata,
  }: ReservationUpdatedDomainEvent): Promise<void> {
    try {
      this.logger.log({
        message: `${ReservationUpdatedDomainEvent.name} received`,
        status,
        eventId: id.uuid,
        aggregateId: aggregateId.uuid,
        metadata: metadata,
      });

      if (status === ReservationStatus.CANCELLED) {
        this.logger.log(`Sending refusal notification for reservation ${aggregateId.uuid}`);
        await this.notificationPort.notifyReservationCancelled(aggregateId);
        return;
      }
    } catch (error) {
      this.logger.error(
        `Error in ReservationUpdatedEventHandler: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
