import { CommandProps, Command } from '@libs/ddd';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { FlightLogProps } from '@modules/reservation/domain/reservation.types';

export class CloseReservationCommand extends Command {
  readonly reservation: ReservationEntity;
  readonly flightLog: FlightLogProps;
  readonly packNote?: string;

  constructor(props: CommandProps<CloseReservationCommand>) {
    super(props);
    this.reservation = props.reservation;
    this.flightLog = props.flightLog;
    this.packNote = props.packNote;
  }
}
