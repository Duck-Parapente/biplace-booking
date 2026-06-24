import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';

import {
  CreateEquipmentNoteProps,
  EquipmentNoteProps,
  UpdateEquipmentNoteProps,
} from './equipment-note.types';
import { EquipmentNoteCreatedDomainEvent } from './events/equipment-note-created.domain-event';

export class EquipmentNoteEntity extends AggregateRoot<EquipmentNoteProps> {
  protected readonly _id!: AggregateID;

  static create(
    props: CreateEquipmentNoteProps,
    metadata: DomainEventMetadata,
  ): EquipmentNoteEntity {
    const id = UUID.random();
    const entity = new EquipmentNoteEntity({
      id,
      createdAt: props.createdAt,
      props,
    });
    entity.addEvent(
      new EquipmentNoteCreatedDomainEvent({
        aggregateId: id,
        profile: props,
        metadata,
      }),
    );
    return entity;
  }

  get equipmentId() {
    return this.props.equipmentId;
  }

  get content() {
    return this.props.content;
  }

  get createdById() {
    return this.props.createdById;
  }

  update(props: UpdateEquipmentNoteProps): void {
    this.props.content = props.content;
  }

  validate(): void {}
}
