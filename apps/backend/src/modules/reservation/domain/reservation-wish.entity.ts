import { randomUUID } from 'crypto';

import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationWishCreatedDomainEvent } from './events/reservation-wish-created.domain-event';
import { ReservationWishStatusUpdatedDomainEvent } from './events/reservation-wish-updated.domain-event';
import { CannotUpdateReservationWishStatusError } from './reservation-wish.exceptions';
import {
  CreateReservationWishProps,
  ReservationWishProps,
  ReservationWishStatus,
} from './reservation-wish.types';
export class ReservationWishEntity extends AggregateRoot<ReservationWishProps> {
  protected readonly _id: AggregateID;

  private static readonly ALLOWED_STATUS_TRANSITIONS: Record<
    ReservationWishStatus,
    ReservationWishStatus[]
  > = {
    [ReservationWishStatus.CANCELLED]: [
      ReservationWishStatus.PENDING,
      ReservationWishStatus.REFUSED,
    ],
    [ReservationWishStatus.CONFIRMED]: [
      ReservationWishStatus.PENDING,
      ReservationWishStatus.REFUSED,
    ],
    [ReservationWishStatus.REFUSED]: [ReservationWishStatus.PENDING, ReservationWishStatus.REFUSED],
    [ReservationWishStatus.PENDING]: [],
  };

  static create(rawProps: CreateReservationWishProps) {
    const id = new UUID({ uuid: randomUUID() });

    const props: ReservationWishProps = {
      ...rawProps,
      status: ReservationWishStatus.PENDING,
      startingDate: rawProps.startingDate.startOfDayInUTC(0),
      endingDate: rawProps.startingDate.startOfDayInUTC(1),
    };

    const entity = new ReservationWishEntity({
      id,
      createdAt: DateValueObject.fromDate(new Date()),
      props,
    });

    entity.addEvent(
      new ReservationWishCreatedDomainEvent({
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

  update(status: ReservationWishStatus, metadata: DomainEventMetadata): void {
    const allowedTransitions = ReservationWishEntity.ALLOWED_STATUS_TRANSITIONS[status];

    if (!allowedTransitions.includes(this.props.status)) {
      throw new CannotUpdateReservationWishStatusError(this.id, this.props.status, status);
    }

    this.props.status = status;

    this.addEvent(
      new ReservationWishStatusUpdatedDomainEvent({
        aggregateId: this.id,
        status,
        metadata,
      }),
    );
  }

  shouldSendNewStatusNotification(newStatus: ReservationWishStatus): boolean {
    if (this.props.status === newStatus) {
      return false;
    }

    return [ReservationWishStatus.CONFIRMED, ReservationWishStatus.REFUSED].includes(newStatus);
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
