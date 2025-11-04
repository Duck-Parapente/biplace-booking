import { DomainEventProps, DomainEvent } from '@libs/ddd';

import { UserProfile } from '../user.types';

// Domain event now carries a single consolidated "changes" object.
export class UserUpdatedDomainEvent extends DomainEvent {
  readonly changes: UserProfile;

  constructor(props: DomainEventProps<UserUpdatedDomainEvent>) {
    super(props);
    this.changes = props.changes;
  }
}
