import { randomUUID } from 'crypto';

import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationCreatedDomainEvent } from './events/reservation-created.domain-event';
import { CreateReservationProps, ReservationProps } from './reservation.types';

export class ReservationEntity extends AggregateRoot<ReservationProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateReservationProps, metadata: DomainEventMetadata) {
    const id = new UUID({ uuid: randomUUID() });

    const entity = new ReservationEntity({
      id,
      createdAt: DateValueObject.fromDate(new Date()),
      props,
    });

    entity.addEvent(
      new ReservationCreatedDomainEvent({
        aggregateId: id,
        reservation: props,
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

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
