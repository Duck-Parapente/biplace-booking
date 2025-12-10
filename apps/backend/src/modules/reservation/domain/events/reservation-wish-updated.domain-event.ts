import { DomainEventProps } from '@libs/ddd';
import { DomainEvent } from '@libs/ddd';

import { ReservationWishStatus } from '../reservation-wish.types';

export class ReservationWishStatusUpdatedDomainEvent extends DomainEvent {
  readonly status: ReservationWishStatus;
  readonly explanationTable?: string;

  constructor(props: DomainEventProps<ReservationWishStatusUpdatedDomainEvent>) {
    super(props);
    this.status = props.status;
    this.explanationTable = props.explanationTable;
  }
}
