import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

export class ReservationCancelledDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ReservationCancelledDomainEvent>) {
    super(props);
  }
}
