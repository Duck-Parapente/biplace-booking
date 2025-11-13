import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

import { UpdatePackProps } from '../pack.types';

export class PackUpdatedDomainEvent extends DomainEvent {
  readonly updates: UpdatePackProps;

  constructor(props: DomainEventProps<PackUpdatedDomainEvent>) {
    super(props);
    this.updates = props.updates;
  }
}
