import { CommandProps, Command, Email } from '@libs/ddd';

export class CreateUserCommand extends Command {
  readonly email: Email;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
  }
}
