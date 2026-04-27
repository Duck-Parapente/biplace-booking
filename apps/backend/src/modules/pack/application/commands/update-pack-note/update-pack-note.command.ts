import { Command, CommandProps } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { UpdatePackNoteProps } from '@modules/pack/domain/pack-note.types';

export class UpdatePackNoteCommand extends Command {
  readonly noteId: UUID;
  readonly updates: UpdatePackNoteProps;

  constructor(props: CommandProps<UpdatePackNoteCommand>) {
    super(props);
    this.noteId = props.noteId;
    this.updates = props.updates;
  }
}
