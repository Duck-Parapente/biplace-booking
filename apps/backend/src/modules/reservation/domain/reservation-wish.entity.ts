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

export const PENDING_STATUSES = [ReservationWishStatus.PENDING, ReservationWishStatus.REFUSED];
export class ReservationWishEntity extends AggregateRoot<ReservationWishProps> {
  protected readonly _id: AggregateID;

  private static readonly ALLOWED_STATUS_TRANSITIONS: Record<
    ReservationWishStatus,
    ReservationWishStatus[]
  > = {
    [ReservationWishStatus.CANCELLED]: PENDING_STATUSES,
    [ReservationWishStatus.CONFIRMED]: PENDING_STATUSES,
    [ReservationWishStatus.REFUSED]: PENDING_STATUSES,
    [ReservationWishStatus.PENDING]: [],
  };

  static create(rawProps: CreateReservationWishProps, metadata: DomainEventMetadata) {
    const id = UUID.random();

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
        metadata,
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

  get userId() {
    return this.props.userId;
  }

  get status() {
    return this.props.status;
  }

  isCancelable(): boolean {
    return (
      ReservationWishEntity.ALLOWED_STATUS_TRANSITIONS[ReservationWishStatus.REFUSED].includes(
        this.props.status,
      ) && this.startingDate.isInTheFuture()
    );
  }

  update(status: ReservationWishStatus, metadata: DomainEventMetadata): void {
    const allowedTransitions = ReservationWishEntity.ALLOWED_STATUS_TRANSITIONS[status];

    if (
      !allowedTransitions.includes(this.props.status) ||
      (status === ReservationWishStatus.REFUSED && !this.isCancelable())
    ) {
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

  shouldSendNewStatusNotification(
    previousStatus: ReservationWishStatus,
    newStatus: ReservationWishStatus,
  ): boolean {
    if (previousStatus === newStatus) {
      return false;
    }

    return [ReservationWishStatus.CONFIRMED, ReservationWishStatus.REFUSED].includes(newStatus);
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
