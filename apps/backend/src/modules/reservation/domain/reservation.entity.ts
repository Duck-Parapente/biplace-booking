import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationCancelledDomainEvent } from './events/reservation-cancelled.domain-event';
import { ReservationCreatedDomainEvent } from './events/reservation-created.domain-event';
import {
  CannotCancelReservationException,
  ReservationInvalidDateRangeException,
} from './reservation.exceptions';
import { CreateReservationProps, ReservationProps, ReservationStatus } from './reservation.types';

export class ReservationEntity extends AggregateRoot<ReservationProps> {
  protected readonly _id!: AggregateID;

  static create(props: CreateReservationProps, metadata: DomainEventMetadata) {
    const id = UUID.random();
    const fullPros = {
      ...props,
      status: ReservationStatus.CONFIRMED,
      cost: Integer.zero(),
    };
    const entity = new ReservationEntity({
      id,
      createdAt: DateValueObject.fromDate(new Date()),
      props: fullPros,
    });

    entity.addEvent(
      new ReservationCreatedDomainEvent({
        aggregateId: id,
        reservation: fullPros,
        metadata,
      }),
    );

    return entity;
  }

  get packId() {
    return this.props.packId;
  }

  get userId() {
    return this.props.userId;
  }

  get startingDate() {
    return this.props.startingDate;
  }

  get endingDate() {
    return this.props.endingDate;
  }

  get publicComment() {
    return this.props.publicComment;
  }

  get reservationWishId() {
    return this.props.reservationWishId;
  }

  get status() {
    return this.props.status;
  }

  get cost() {
    return this.props.cost;
  }

  cancel(metadata: DomainEventMetadata): void {
    if (!this.isCancelable()) {
      throw new CannotCancelReservationException(this.id, this.props.status);
    }
    this.props.status = ReservationStatus.CANCELLED;

    this.addEvent(
      new ReservationCancelledDomainEvent({
        aggregateId: this.id,
        metadata,
      }),
    );
  }

  isCancelable(): boolean {
    return this.props.status === ReservationStatus.CONFIRMED;
  }

  validate(): void {
    if (!this.startingDate.isBefore(this.endingDate)) {
      throw new ReservationInvalidDateRangeException(this.startingDate, this.endingDate);
    }
  }
}
