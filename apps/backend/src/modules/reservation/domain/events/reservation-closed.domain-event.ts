import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { FlightLogProps } from '../reservation.types';

export interface ClosedReservationContext {
  packId: UUID;
  startingDate: DateValueObject;
  automaticCost: Integer;
}

export class ReservationClosedDomainEvent extends DomainEvent {
  readonly userId?: UUID;
  readonly reservation: ClosedReservationContext;
  readonly flightLog: FlightLogProps;
  readonly packNote?: string;

  constructor(props: DomainEventProps<ReservationClosedDomainEvent>) {
    super(props);
    this.userId = props.userId;
    this.reservation = props.reservation;
    this.flightLog = props.flightLog;
    this.packNote = props.packNote;
  }
}
