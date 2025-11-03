import { CommandProps, Command } from '@libs/ddd';

export class GetUserCommand extends Command {
  readonly userId: string;

  constructor(props: CommandProps<GetUserCommand>) {
    super(props);
    this.userId = props.userId;
  }
}
