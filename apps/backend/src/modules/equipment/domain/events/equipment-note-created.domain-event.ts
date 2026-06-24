import { DomainEvent, DomainEventProps } from '@libs/ddd';

import { EquipmentNoteProfile } from '../equipment-note.types';

export class EquipmentNoteCreatedDomainEvent extends DomainEvent {
  readonly profile: EquipmentNoteProfile;

  constructor(props: DomainEventProps<EquipmentNoteCreatedDomainEvent>) {
    super(props);
    this.profile = props.profile;
  }
}
