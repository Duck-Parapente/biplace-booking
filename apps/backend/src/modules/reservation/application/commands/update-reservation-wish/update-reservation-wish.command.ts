import { CommandProps, Command } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishStatus } from '@modules/reservation/domain/reservation-wish.types';

export class UpdateReservationWishCommand extends Command {
  readonly reservationWishId: UUID;
  readonly userId: UUID;
  readonly status: ReservationWishStatus;

  constructor(props: CommandProps<UpdateReservationWishCommand>) {
    super(props);
    this.reservationWishId = props.reservationWishId;
    this.userId = props.userId;
    this.status = props.status;
  }
}
