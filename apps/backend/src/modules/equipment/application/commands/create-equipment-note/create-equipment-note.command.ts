import { Command, CommandProps } from '@libs/ddd';
import { CreateEquipmentNoteProps } from '@modules/equipment/domain/equipment-note.types';

export class CreateEquipmentNoteCommand extends Command {
  readonly props: CreateEquipmentNoteProps;

  constructor(commandProps: CommandProps<CreateEquipmentNoteCommand>) {
    super(commandProps);
    this.props = commandProps.props;
  }
}
