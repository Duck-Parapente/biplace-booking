import { randomUUID } from 'crypto';

import { AggregateRoot, AggregateID } from '@libs/ddd';

import { UserCreatedDomainEvent } from './events/user-created.domain-event';
import { CreateUserProps, UserProps } from './user.types';

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateUserProps): UserEntity {
    const id = randomUUID();
    const user = new UserEntity({ id, props });
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        email: props.email,
        externalAuthId: props.externalAuthId,
      }),
    );
    return user;
  }

  get email() {
    return this.props.email;
  }

  get externalAuthId() {
    return this.props.externalAuthId;
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
