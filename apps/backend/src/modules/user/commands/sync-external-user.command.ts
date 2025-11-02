import { CommandProps, Command } from '@libs/ddd/command.base';
import { Email } from '@libs/ddd/email.value-object';

export class SyncExternalUserCommand extends Command {
  readonly externalAuthId: string;
  readonly email: Email;

  constructor(props: CommandProps<SyncExternalUserCommand>) {
    super(props);
    this.externalAuthId = props.externalAuthId;
    this.email = props.email;
  }
}
