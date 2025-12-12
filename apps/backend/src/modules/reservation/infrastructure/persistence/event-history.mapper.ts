import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { ReservationCancelledDomainEvent } from '@modules/reservation/domain/events/reservation-cancelled.domain-event';
import { ReservationClosedDomainEvent } from '@modules/reservation/domain/events/reservation-closed.domain-event';
import { ReservationUpdatedDomainEvent } from '@modules/reservation/domain/events/reservation-updated.domain-event';
import {
  ReservationEvent,
  ReservationHistory,
  ReservationWishHistory,
  StatusUpdate,
} from '@modules/reservation/domain/reservation-wish.read-models';
import { ReservationWishStatus } from '@modules/reservation/domain/reservation-wish.types';
import { ReservationStatus } from '@modules/reservation/domain/reservation.types';
import { Event } from '@prisma/client';

import { ReservationWishEntity } from '../../domain/reservation-wish.entity';
import { ReservationEntity } from '../../domain/reservation.entity';

/**
 * Maps event name to reservation status
 */
const mapEventNameToReservationStatus = (eventName: string): ReservationStatus | null => {
  switch (eventName) {
    case ReservationCancelledDomainEvent.name:
      return ReservationStatus.CANCELLED;
    case ReservationClosedDomainEvent.name:
      return ReservationStatus.CLOSED;
    default:
      return null;
  }
};

/**
 * Builds status update history for a reservation wish
 */
export const buildReservationWishHistory = (
  wish: ReservationWishEntity,
  events: Event[],
): ReservationWishHistory => {
  const statusUpdates: StatusUpdate[] = [
    // Initial status when created
    new StatusUpdate(ReservationWishStatus.PENDING, wish.createdAt),
  ];

  // Add subsequent status changes, excluding CONFIRMED (handled by reservation)
  events.forEach((event) => {
    const payload = event.payload as { status: string };
    const status = payload.status as ReservationWishStatus;

    if (status !== ReservationWishStatus.CONFIRMED) {
      statusUpdates.push(new StatusUpdate(status, DateValueObject.fromDate(event.createdAt)));
    }
  });

  return new ReservationWishHistory(wish, statusUpdates);
};

/**
 * Builds status and event history for a reservation
 */
export const buildReservationHistory = (
  reservation: ReservationEntity,
  events: Event[],
): ReservationHistory => {
  const statusUpdates: StatusUpdate[] = [
    // Initial status when created
    new StatusUpdate(ReservationStatus.CONFIRMED, reservation.createdAt),
  ];

  const otherEvents: ReservationEvent[] = [];

  events.forEach((event) => {
    const status = mapEventNameToReservationStatus(event.name);

    if (status) {
      // It's a status update event
      statusUpdates.push(new StatusUpdate(status, DateValueObject.fromDate(event.createdAt)));
    } else if (event.name === ReservationUpdatedDomainEvent.name) {
      // It's a cost update event
      const payload = event.payload as { cost: { props: { value: number } } };
      otherEvents.push(
        new ReservationEvent(
          'COST_UPDATED',
          new Integer({ value: payload.cost.props.value }),
          DateValueObject.fromDate(event.createdAt),
        ),
      );
    }
  });

  return new ReservationHistory(reservation, statusUpdates, otherEvents);
};
