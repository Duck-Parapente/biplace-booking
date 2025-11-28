import { CommandProps, Command } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { UpdatePackProps } from '@modules/pack/domain/pack.types';

export class UpdatePackCommand extends Command {
  readonly packId: UUID;
  readonly updates: UpdatePackProps;

  constructor(props: CommandProps<UpdatePackCommand>) {
    super(props);
    this.packId = props.packId;
    this.updates = props.updates;
  }
}
