import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

import { ReservationWishProps } from '../reservation.types';

export class ReservationwishCreatedDomainEvent extends DomainEvent {
  readonly reservationWish: ReservationWishProps;

  constructor(props: DomainEventProps<ReservationwishCreatedDomainEvent>) {
    super(props);
    this.reservationWish = props.reservationWish;
  }
}
