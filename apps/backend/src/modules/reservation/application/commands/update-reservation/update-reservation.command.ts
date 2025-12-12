import { CommandProps, Command } from '@libs/ddd';
import { Integer } from '@libs/ddd/integer.value-object';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';

export class UpdateReservationCommand extends Command {
  readonly reservation: ReservationEntity;
  readonly cost: Integer;

  constructor(props: CommandProps<UpdateReservationCommand>) {
    super(props);
    this.reservation = props.reservation;
    this.cost = props.cost;
  }
}
