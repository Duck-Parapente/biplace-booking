import { DomainEventProps } from '@libs/ddd';
import { Email } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly email: Email;
  readonly externalAuthId: string;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.email = props.email;
    this.externalAuthId = props.externalAuthId;
  }
}
