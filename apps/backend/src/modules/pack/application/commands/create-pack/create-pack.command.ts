import { CommandProps, Command } from '@libs/ddd';
import { PackProfile } from '@modules/pack/domain/pack.types';

export class CreatePackCommand extends Command {
  readonly profile: PackProfile;

  constructor(props: CommandProps<CreatePackCommand>) {
    super(props);
    this.profile = props.profile;
  }
}
