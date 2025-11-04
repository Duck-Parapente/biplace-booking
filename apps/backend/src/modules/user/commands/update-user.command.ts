import { CommandProps, Command } from '@libs/ddd';

export class UpdateUserCommand extends Command {
  readonly userId: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly address?: string;
  readonly phoneNumber?: string;

  constructor(props: CommandProps<UpdateUserCommand>) {
    super(props);
    this.userId = props.userId;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.address = props.address;
    this.phoneNumber = props.phoneNumber;
  }
}
