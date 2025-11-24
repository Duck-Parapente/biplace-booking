import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

import { ReservationProps } from '../reservation.types';

export class ReservationCreatedDomainEvent extends DomainEvent {
  readonly reservation: ReservationProps;

  constructor(props: DomainEventProps<ReservationCreatedDomainEvent>) {
    super(props);
    this.reservation = props.reservation;
  }
}
