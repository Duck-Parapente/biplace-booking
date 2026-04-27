import { Command, CommandProps } from '@libs/ddd';
import { CreatePackNoteProps } from '@modules/pack/domain/pack-note.types';

export class CreatePackNoteCommand extends Command {
  readonly props: CreatePackNoteProps;

  constructor(commandProps: CommandProps<CreatePackNoteCommand>) {
    super(commandProps);
    this.props = commandProps.props;
  }
}
