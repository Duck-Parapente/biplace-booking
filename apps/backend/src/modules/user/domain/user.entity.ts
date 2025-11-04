import { randomUUID } from 'crypto';

import { AggregateRoot, AggregateID } from '@libs/ddd';

import { UserCreatedDomainEvent } from './events/user-created.domain-event';
import { UserUpdatedDomainEvent } from './events/user-updated.domain-event';
import { CreateUserProps, UpdateUserProps, UserProps } from './user.types';

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateUserProps): UserEntity {
    const id = randomUUID();
    const user = new UserEntity({ id, props });
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        ...props,
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

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get phoneNumber() {
    return this.props.phoneNumber;
  }

  get address() {
    return this.props.address;
  }

  get currentScore() {
    return this.props.currentScore;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  update(props: UpdateUserProps): void {
    Object.assign(this.props, props);

    this.addEvent(
      new UserUpdatedDomainEvent({
        aggregateId: this.id,
        changes: props,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
