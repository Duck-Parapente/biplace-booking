import { CommandProps, Command } from '@libs/ddd';

import { UserProfile } from '../domain/user.types';

export class UpdateUserCommand extends Command {
  readonly userId: string;
  readonly profile: UserProfile;

  constructor(props: CommandProps<UpdateUserCommand>) {
    super(props);
    this.userId = props.userId;
    this.profile = props.profile;
  }
}
