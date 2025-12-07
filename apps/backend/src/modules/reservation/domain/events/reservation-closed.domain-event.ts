import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';

import { FlightLogProps } from '../reservation.types';

export class ReservationClosedDomainEvent extends DomainEvent {
  readonly userId?: UUID;
  readonly flightLog: FlightLogProps;

  constructor(props: DomainEventProps<ReservationClosedDomainEvent>) {
    super(props);
    this.userId = props.userId;
    this.flightLog = props.flightLog;
  }
}
