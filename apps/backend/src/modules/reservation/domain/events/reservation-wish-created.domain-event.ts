import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

import { ReservationWishProps } from '../reservation-wish.types';

export class ReservationWishCreatedDomainEvent extends DomainEvent {
  readonly reservationWish: ReservationWishProps;

  constructor(props: DomainEventProps<ReservationWishCreatedDomainEvent>) {
    super(props);
    this.reservationWish = props.reservationWish;
  }
}
