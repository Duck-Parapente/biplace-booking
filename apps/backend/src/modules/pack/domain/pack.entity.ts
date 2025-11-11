import { randomUUID } from 'crypto';

import { AggregateRoot, AggregateID } from '@libs/ddd';

import { PackCreatedDomainEvent } from './events/pack-created.domain-event';
import { CreatePackProps, PackProps } from './pack.types';

export class PackEntity extends AggregateRoot<PackProps> {
  protected readonly _id: AggregateID;

  static create(profile: CreatePackProps): PackEntity {
    const id = randomUUID();
    const user = new PackEntity({ id, props: profile });
    user.addEvent(
      new PackCreatedDomainEvent({
        aggregateId: id,
        profile,
      }),
    );
    return user;
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
