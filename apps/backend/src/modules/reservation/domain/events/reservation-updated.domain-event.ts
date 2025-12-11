import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';
import { Integer } from '@libs/ddd/integer.value-object';

export class ReservationUpdatedDomainEvent extends DomainEvent {
  readonly cost: Integer;

  constructor(props: DomainEventProps<ReservationUpdatedDomainEvent>) {
    super(props);
    this.cost = props.cost;
  }
}
