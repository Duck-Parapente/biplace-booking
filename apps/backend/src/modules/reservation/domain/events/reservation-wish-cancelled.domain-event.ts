import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

export class ReservationwishCancelledDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ReservationwishCancelledDomainEvent>) {
    super(props);
  }
}
