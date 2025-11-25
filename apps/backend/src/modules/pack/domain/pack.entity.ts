import { randomUUID } from 'crypto';

import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { PackCreatedDomainEvent } from './events/pack-created.domain-event';
import { PackUpdatedDomainEvent } from './events/pack-updated.domain-event';
import { CreatePackProps, PackProps, UpdatePackProps } from './pack.types';

export class PackEntity extends AggregateRoot<PackProps> {
  protected readonly _id: AggregateID;

  static create(profile: CreatePackProps, metadata: DomainEventMetadata): PackEntity {
    const id = new UUID({ uuid: randomUUID() });
    const user = new PackEntity({
      id,
      createdAt: DateValueObject.fromDate(new Date()),
      props: {
        ...profile,
        flightsCount: profile.flightsCount ?? 0,
        flightsHours: profile.flightsHours ?? 0,
      },
    });
    user.addEvent(
      new PackCreatedDomainEvent({
        aggregateId: id,
        profile,
        metadata,
      }),
    );
    return user;
  }

  update(updates: UpdatePackProps, metadata: DomainEventMetadata): void {
    Object.assign(this.props, updates);

    this.addEvent(
      new PackUpdatedDomainEvent({
        aggregateId: this.id,
        updates,
        metadata,
      }),
    );
  }

  get label() {
    return this.props.label;
  }

  get flightsHours() {
    return this.props.flightsHours;
  }

  get flightsCount() {
    return this.props.flightsCount;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
