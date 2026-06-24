import { DomainEvent, DomainEventProps } from '@libs/ddd';

export class EquipmentHolderChangedDomainEvent extends DomainEvent {
  readonly holderId: string | null;

  constructor(props: DomainEventProps<EquipmentHolderChangedDomainEvent>) {
    super(props);
    this.holderId = props.holderId;
  }
}
