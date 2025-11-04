import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

export class UserUpdatedDomainEvent extends DomainEvent {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly address?: string;
  readonly phoneNumber?: string;

  constructor(props: DomainEventProps<UserUpdatedDomainEvent>) {
    super(props);
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.address = props.address;
    this.phoneNumber = props.phoneNumber;
  }
}
