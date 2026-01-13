import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export class ReservationCancelledDomainEvent extends DomainEvent {
  readonly automaticCost: Integer;
  readonly userId?: UUID;

  constructor(props: DomainEventProps<ReservationCancelledDomainEvent>) {
    super(props);
    this.automaticCost = props.automaticCost;
    this.userId = props.userId;
  }
}
