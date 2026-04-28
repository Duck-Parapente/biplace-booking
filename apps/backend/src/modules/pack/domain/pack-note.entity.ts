import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { PackNoteCreatedDomainEvent } from './events/pack-note-created.domain-event';
import { CreatePackNoteProps, PackNoteProps, UpdatePackNoteProps } from './pack-note.types';

export class PackNoteEntity extends AggregateRoot<PackNoteProps> {
  protected readonly _id!: AggregateID;

  static create(props: CreatePackNoteProps, metadata: DomainEventMetadata): PackNoteEntity {
    const id = UUID.random();
    const entity = new PackNoteEntity({
      id,
      createdAt: DateValueObject.fromDate(new Date()),
      props,
    });
    entity.addEvent(
      new PackNoteCreatedDomainEvent({
        aggregateId: id,
        profile: props,
        metadata,
      }),
    );
    return entity;
  }

  get packId() {
    return this.props.packId;
  }

  get content() {
    return this.props.content;
  }

  get createdById() {
    return this.props.createdById;
  }

  update(props: UpdatePackNoteProps): void {
    this.props.content = props.content;
  }

  validate(): void {}
}
