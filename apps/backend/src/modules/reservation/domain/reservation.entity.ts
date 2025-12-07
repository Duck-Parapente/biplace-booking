import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationCancelledDomainEvent } from './events/reservation-cancelled.domain-event';
import { ReservationClosedDomainEvent } from './events/reservation-closed.domain-event';
import { ReservationCreatedDomainEvent } from './events/reservation-created.domain-event';
import {
  CannotCancelReservationException,
  CannotCloseReservationException,
  ReservationInvalidDateRangeException,
} from './reservation.exceptions';
import {
  CreateReservationProps,
  FlightLogProps,
  ReservationProps,
  ReservationStatus,
} from './reservation.types';

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

  cancel(metadata: DomainEventMetadata): ReservationEntity {
    if (!this.isCancelable()) {
      throw new CannotCancelReservationException(this.id, this.props.status);
    }
    this.props.status = ReservationStatus.CANCELLED;
    this.props.cost = this.calculateCost();

    this.addEvent(
      new ReservationCancelledDomainEvent({
        aggregateId: this.id,
        metadata,
        cost: this.props.cost,
        userId: this.props.userId,
      }),
    );

    return this;
  }

  private calculateCost(): Integer {
    if (!this.startingDate.isInTheFuture()) return Integer.zero();

    return this.createdAt.daysBetween(DateValueObject.now());
  }

  isCancelable(): boolean {
    return this.canBeModified();
  }

  close(flightLog: FlightLogProps, metadata: DomainEventMetadata): ReservationEntity {
    if (!this.isCloseable()) {
      throw new CannotCloseReservationException(this.id, this.props.status);
    }

    this.props.status = ReservationStatus.CLOSED;

    this.addEvent(
      new ReservationClosedDomainEvent({
        aggregateId: this.id,
        metadata,
        userId: this.props.userId,
        flightLog,
      }),
    );

    return this;
  }

  isCloseable(): boolean {
    return this.canBeModified();
  }

  validate(): void {
    if (!this.startingDate.isBefore(this.endingDate)) {
      throw new ReservationInvalidDateRangeException(this.startingDate, this.endingDate);
    }
  }

  private canBeModified(): boolean {
    return this.props.status === ReservationStatus.CONFIRMED;
  }
}
