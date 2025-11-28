import { CommandProps, Command } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';

export class GetUserCommand extends Command {
  readonly userId: UUID;

  constructor(props: CommandProps<GetUserCommand>) {
    super(props);
    this.userId = props.userId;
  }
}
