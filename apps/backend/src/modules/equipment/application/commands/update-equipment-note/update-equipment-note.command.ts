import { Command, CommandProps } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { UpdateEquipmentNoteProps } from '@modules/equipment/domain/equipment-note.types';

export class UpdateEquipmentNoteCommand extends Command {
  readonly noteId: UUID;
  readonly updates: UpdateEquipmentNoteProps;

  constructor(props: CommandProps<UpdateEquipmentNoteCommand>) {
    super(props);
    this.noteId = props.noteId;
    this.updates = props.updates;
  }
}
