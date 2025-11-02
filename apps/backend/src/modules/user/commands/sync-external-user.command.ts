import { CommandProps, Command } from '@libs/ddd/command.base';

export class SyncExternalUserCommand extends Command {
  readonly externalAuthId: string;

  constructor(props: CommandProps<SyncExternalUserCommand>) {
    super(props);
    this.externalAuthId = props.externalAuthId;
  }
}
