import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationCreatedDomainEvent } from './events/reservation-created.domain-event';
import { ReservationUpdatedDomainEvent } from './events/reservation-updated.domain-event';
import { CannotCancelReservationError } from './reservation.exceptions';
import { CreateReservationProps, ReservationProps, ReservationStatus } from './reservation.types';

export class ReservationEntity extends AggregateRoot<ReservationProps> {
  protected readonly _id!: AggregateID;

  static create(props: CreateReservationProps, metadata: DomainEventMetadata) {
    const id = UUID.random();
    const fullPros = {
      ...props,
      status: ReservationStatus.CONFIRMED,
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

  cancel(metadata: DomainEventMetadata): void {
    if (this.props.status !== ReservationStatus.CONFIRMED) {
      throw new CannotCancelReservationError(this.id, this.props.status);
    }
    this.props.status = ReservationStatus.CANCELLED;

    this.addEvent(
      new ReservationUpdatedDomainEvent({
        aggregateId: this.id,
        status: this.props.status,
        metadata,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
