import { AggregateRoot, AggregateID, DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Logger } from '@nestjs/common';

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
  protected readonly logger = new Logger(ReservationEntity.name);

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
    this.props.cost = this.calculateCancellationCost();

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

  private calculateCancellationCost(): Integer {
    if (!this.startingDate.isInTheFuture()) {
      this.logger.log({
        reservationId: this.id.uuid,
        input: {
          createdAt: this.createdAt.value.toISOString(),
          startingDate: this.startingDate.value.toISOString(),
          now: new Date().toISOString(),
        },
        output: { cost: 0 },
      });
      return Integer.zero();
    }

    const daysSinceCreation = this.createdAt.daysBetween(DateValueObject.now());
    const maxAllowedCost = this.calculateMaxCost();
    const result = daysSinceCreation.min(maxAllowedCost);

    this.logger.log({
      reservationId: this.id.uuid,
      input: {
        createdAt: this.createdAt.value.toISOString(),
        startingDate: this.startingDate.value.toISOString(),
        now: new Date().toISOString(),
      },
      output: { cost: result.value },
    });

    return result;
  }

  private calculateClosingCost(): Integer {
    const result = this.calculateMaxCost();

    this.logger.log({
      reservationId: this.id.uuid,
      input: {
        createdAt: this.createdAt.value.toISOString(),
        startingDate: this.startingDate.value.toISOString(),
      },
      output: { cost: result.value },
    });

    return result;
  }

  private calculateMaxCost(): Integer {
    return this.createdAt.daysBetween(this.startingDate).max(Integer.zero());
  }

  isCancelable(): boolean {
    return this.canBeModified();
  }

  isClosable(): boolean {
    return this.canBeModified();
  }

  close(flightLog: FlightLogProps, metadata: DomainEventMetadata): ReservationEntity {
    if (!this.isClosable()) {
      throw new CannotCloseReservationException(this.id, this.props.status);
    }

    this.props.status = ReservationStatus.CLOSED;
    this.props.cost = this.calculateClosingCost();

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

  validate(): void {
    if (!this.startingDate.isBefore(this.endingDate)) {
      throw new ReservationInvalidDateRangeException(this.startingDate, this.endingDate);
    }
  }

  private canBeModified(): boolean {
    return this.props.status === ReservationStatus.CONFIRMED;
  }
}
