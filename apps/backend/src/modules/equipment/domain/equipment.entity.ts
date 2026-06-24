import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';

import { EquipmentProps } from './equipment.types';
import { EquipmentHolderChangedDomainEvent } from './events/equipment-holder-changed.domain-event';

export class EquipmentEntity extends AggregateRoot<EquipmentProps> {
  protected readonly _id!: AggregateID;

  get label() {
    return this.props.label;
  }

  get order() {
    return this.props.order;
  }

  get currentHolderId() {
    return this.props.currentHolderId;
  }

  get currentHolderName() {
    return this.props.currentHolderName ?? null;
  }

  setHolder(holderId: UUID | null, metadata: DomainEventMetadata): void {
    this.props.currentHolderId = holderId;

    this.addEvent(
      new EquipmentHolderChangedDomainEvent({
        aggregateId: this.id,
        holderId: holderId?.uuid ?? null,
        metadata,
      }),
    );
  }

  validate(): void {}
}
