import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';

import { ReservationWishEntity } from './reservation-wish.entity';
import { ReservationWishStatus } from './reservation-wish.types';
import { ReservationEntity } from './reservation.entity';
import { ReservationStatus } from './reservation.types';

/**
 * Status update events - represents state transitions
 */
export class StatusUpdate {
  constructor(
    public readonly status: ReservationWishStatus | ReservationStatus,
    public readonly occurredAt: DateValueObject,
  ) {}
}

/**
 * Non-status events - represents other domain events
 */
export class ReservationCostEvent {
  constructor(
    public readonly type: 'MANUAL_COST_UPDATED' | 'AUTOMATIC_COST_UPDATED',
    public readonly cost: Integer,
    public readonly occurredAt: DateValueObject,
  ) {}
}

/**
 * Complete history for a reservation wish
 */
export class ReservationWishHistory {
  constructor(
    public readonly wish: ReservationWishEntity,
    public readonly statusUpdates: StatusUpdate[],
  ) {}
}

/**
 * Complete history for a reservation
 */
export class ReservationHistory {
  constructor(
    public readonly reservation: ReservationEntity,
    public readonly statusUpdates: StatusUpdate[],
    public readonly costEvents: ReservationCostEvent[],
  ) {}
}

/**
 * Aggregate read model for user's reservation wishes with full history
 */
export class ReservationWishWithHistory {
  constructor(
    public readonly wishHistory: ReservationWishHistory,
    public readonly reservationHistory: ReservationHistory | null,
  ) {}
}
