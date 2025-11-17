import { CommandProps, Command } from '@libs/ddd';

import { CreateReservationWishProps } from '../domain/reservation.types';

export class CreateReservationWishCommand extends Command {
  readonly reservationWish: CreateReservationWishProps;

  constructor(props: CommandProps<CreateReservationWishCommand>) {
    super(props);
    this.reservationWish = props.reservationWish;
  }
}
