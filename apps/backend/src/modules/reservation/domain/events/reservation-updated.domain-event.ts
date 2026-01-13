import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';
import { Integer } from '@libs/ddd/integer.value-object';

export class ReservationUpdatedDomainEvent extends DomainEvent {
  readonly manualCost: Integer;

  constructor(props: DomainEventProps<ReservationUpdatedDomainEvent>) {
    super(props);
    this.manualCost = props.manualCost;
  }
}
