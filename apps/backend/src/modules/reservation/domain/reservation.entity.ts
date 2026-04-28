import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Logger } from '@nestjs/common';

import { ReservationCancelledDomainEvent } from './events/reservation-cancelled.domain-event';
import { ReservationClosedDomainEvent } from './events/reservation-closed.domain-event';
import { ReservationCreatedDomainEvent } from './events/reservation-created.domain-event';
import { ReservationUpdatedDomainEvent } from './events/reservation-updated.domain-event';
import { calculateReservationCost, ReservationCostEventType } from './reservation-cost.helper';
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
  protected readonly logger = new Logger(ReservationEntity.name);

  static create(
    props: CreateReservationProps,
    metadata: DomainEventMetadata,
    explanationTable: string,
  ): ReservationEntity {
    const id = UUID.random();
    const fullProps = {
      ...props,
      status: ReservationStatus.CONFIRMED,
      manualCost: null,
      automaticCost: null,
    };
    const entity = new ReservationEntity({
      id,
      createdAt: DateValueObject.fromDate(new Date()),
      props: fullProps,
    });

    entity.addEvent(
      new ReservationCreatedDomainEvent({
        aggregateId: id,
        reservation: fullProps,
        metadata,
        explanationTable,
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

  get context() {
    return this.props.context;
  }

  get reservationWishId() {
    return this.props.reservationWishId;
  }

  get status() {
    return this.props.status;
  }

  get manualCost() {
    return this.props.manualCost;
  }

  get automaticCost() {
    return this.props.automaticCost;
  }

  cancel(metadata: DomainEventMetadata): ReservationEntity {
    if (!this.isCancelable()) {
      throw new CannotCancelReservationException(this.id, this.props.status);
    }
    this.props.status = ReservationStatus.CANCELLED;
    this.props.automaticCost = this.calculateCost(ReservationCostEventType.CANCEL);

    this.addEvent(
      new ReservationCancelledDomainEvent({
        aggregateId: this.id,
        metadata,
        automaticCost: this.props.automaticCost,
        userId: this.props.userId,
      }),
    );

    return this;
  }

  private calculateCost(eventType: ReservationCostEventType): Integer {
    const now = DateValueObject.now();

    const cost = calculateReservationCost({
      eventType,
      createdAt: this.createdAt,
      startingDate: this.startingDate,
      context: this.context,
      now,
    });

    this.logger.log({
      reservationId: this.id.uuid,
      input: {
        createdAt: this.createdAt.value.toISOString(),
        startingDate: this.startingDate.value.toISOString(),
        now: now.value.toISOString(),
      },
      output: { automaticCost: cost.value },
    });

    return cost;
  }

  isCancelable(): boolean {
    return this.canBeModified();
  }

  isClosable(): boolean {
    return this.canBeModified();
  }

  close(
    flightLog: FlightLogProps,
    packNote: string | undefined,
    metadata: DomainEventMetadata,
  ): ReservationEntity {
    if (!this.isClosable()) {
      throw new CannotCloseReservationException(this.id, this.props.status);
    }

    this.props.status = ReservationStatus.CLOSED;
    this.props.automaticCost = this.calculateCost(ReservationCostEventType.CLOSE);

    this.addEvent(
      new ReservationClosedDomainEvent({
        aggregateId: this.id,
        metadata,
        userId: this.props.userId,
        reservation: {
          packId: this.props.packId,
          startingDate: this.props.startingDate,
          automaticCost: this.props.automaticCost,
        },
        flightLog,
        packNote,
      }),
    );

    return this;
  }

  updateManualCost(manualCost: Integer, metadata: DomainEventMetadata): ReservationEntity {
    this.props.manualCost = manualCost;

    this.addEvent(
      new ReservationUpdatedDomainEvent({
        aggregateId: this.id,
        userId: this.props.userId,
        metadata,
        manualCost,
      }),
    );

    return this;
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
