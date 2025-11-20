import { randomUUID } from 'crypto';

import { AggregateRoot, AggregateID } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationwishCancelledDomainEvent } from './events/reservation-wish-cancelled.domain-event';
import { ReservationwishCreatedDomainEvent } from './events/reservation-wish-created.domain-event';
import { CannotCancelConfirmedReservationWishError } from './reservation.exceptions';
import {
  CreateReservationWishProps,
  ReservationWishProps,
  ReservationWishStatus,
} from './reservation.types';

export class ReservationWishEntity extends AggregateRoot<ReservationWishProps> {
  protected readonly _id: AggregateID;

  static create(rawProps: CreateReservationWishProps) {
    const id = new UUID({ uuid: randomUUID() });

    const start = rawProps.startingDate.value;

    const normalizedStart = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0),
    );

    const normalizedEnd = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 1, 0, 0, 0),
    );

    const props: ReservationWishProps = {
      ...rawProps,
      status: ReservationWishStatus.PENDING,
      startingDate: DateValueObject.fromDate(normalizedStart),
      endingDate: DateValueObject.fromDate(normalizedEnd),
    };

    const entity = new ReservationWishEntity({
      id,
      createdAt: DateValueObject.fromDate(new Date()),
      props,
    });

    entity.addEvent(
      new ReservationwishCreatedDomainEvent({
        aggregateId: id,
        reservationWish: props,
      }),
    );

    return entity;
  }

  get publicComment() {
    return this.props.publicComment;
  }

  get startingDate() {
    return this.props.startingDate;
  }

  get endingDate() {
    return this.props.endingDate;
  }
  get packChoices() {
    return this.props.packChoices;
  }

  get createdById() {
    return this.props.createdById;
  }

  get status() {
    return this.props.status;
  }

  cancel() {
    if (this.props.status === ReservationWishStatus.CANCELLED) {
      return;
    }

    if (this.props.status === ReservationWishStatus.CONFIRMED) {
      throw new CannotCancelConfirmedReservationWishError(this.id);
    }

    this.props.status = ReservationWishStatus.CANCELLED;

    this.addEvent(
      new ReservationwishCancelledDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
