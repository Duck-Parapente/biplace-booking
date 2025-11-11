import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

import { PackProfile } from '../pack.types';

export class PackCreatedDomainEvent extends DomainEvent {
  readonly profile: PackProfile;

  constructor(props: DomainEventProps<PackCreatedDomainEvent>) {
    super(props);
    this.profile = props.profile;
  }
}
