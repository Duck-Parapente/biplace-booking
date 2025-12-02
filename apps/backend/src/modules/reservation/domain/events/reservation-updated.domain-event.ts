import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

import { ReservationStatus } from '../reservation.types';

export class ReservationUpdatedDomainEvent extends DomainEvent {
  readonly status: ReservationStatus;

  constructor(props: DomainEventProps<ReservationUpdatedDomainEvent>) {
    super(props);
    this.status = props.status;
  }
}
