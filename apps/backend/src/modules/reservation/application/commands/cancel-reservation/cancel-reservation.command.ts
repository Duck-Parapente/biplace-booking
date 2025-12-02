import { CommandProps, Command } from '@libs/ddd';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';

export class CancelReservationCommand extends Command {
  readonly reservation: ReservationEntity;

  constructor(props: CommandProps<CancelReservationCommand>) {
    super(props);
    this.reservation = props.reservation;
  }
}
