import { DomainEvent, DomainEventProps } from '@libs/ddd';

import { PackNoteProfile } from '../pack-note.types';

export class PackNoteCreatedDomainEvent extends DomainEvent {
  readonly profile: PackNoteProfile;

  constructor(props: DomainEventProps<PackNoteCreatedDomainEvent>) {
    super(props);
    this.profile = props.profile;
  }
}
