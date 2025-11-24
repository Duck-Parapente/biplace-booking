import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

import { ReservationWishStatus } from '../reservation.types';

export class ReservationWishStatusUpdatedDomainEvent extends DomainEvent {
  readonly status: ReservationWishStatus;

  constructor(props: DomainEventProps<ReservationWishStatusUpdatedDomainEvent>) {
    super(props);
    this.status = props.status;
  }
}
