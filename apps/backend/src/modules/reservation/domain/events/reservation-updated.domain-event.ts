import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export class ReservationUpdatedDomainEvent extends DomainEvent {
  readonly manualCost: Integer;
  readonly userId?: UUID;

  constructor(props: DomainEventProps<ReservationUpdatedDomainEvent>) {
    super(props);
    this.manualCost = props.manualCost;
    this.userId = props.userId;
  }
}
