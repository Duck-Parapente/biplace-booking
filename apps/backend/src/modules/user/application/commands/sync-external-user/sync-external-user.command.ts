import { CommandProps, Command, Email } from '@libs/ddd';

export class SyncExternalUserCommand extends Command {
  readonly externalAuthId: string;
  readonly email: Email;

  constructor(props: CommandProps<SyncExternalUserCommand>) {
    super(props);
    this.externalAuthId = props.externalAuthId;
    this.email = props.email;
  }
}
