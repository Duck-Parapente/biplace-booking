import { CommandProps, Command } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';

export class CancelReservationWishCommand extends Command {
  readonly reservationWishId: UUID;

  constructor(props: CommandProps<CancelReservationWishCommand>) {
    super(props);
    this.reservationWishId = props.reservationWishId;
  }
}
