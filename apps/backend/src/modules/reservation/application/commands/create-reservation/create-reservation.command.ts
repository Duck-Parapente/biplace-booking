import { CommandProps, Command } from '@libs/ddd';
import { CreateReservationProps } from '@modules/reservation/domain/reservation.types';

export class CreateReservationCommand extends Command {
  readonly reservation: CreateReservationProps;
  readonly explanationTable: string;

  constructor(props: CommandProps<CreateReservationCommand>) {
    super(props);
    this.reservation = props.reservation;
    this.explanationTable = props.explanationTable;
  }
}
