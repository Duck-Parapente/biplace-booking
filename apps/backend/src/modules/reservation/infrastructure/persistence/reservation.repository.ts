import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { PackSummary } from '@libs/types/accross-modules';
import { ReservationCancelledDomainEvent } from '@modules/reservation/domain/events/reservation-cancelled.domain-event';
import { ReservationClosedDomainEvent } from '@modules/reservation/domain/events/reservation-closed.domain-event';
import {
  PackReservationWithDetails,
  ReservationRepositoryPort,
} from '@modules/reservation/domain/ports/reservation.repository.port';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { PlanningReservationDto } from '@modules/reservation/domain/reservation.types';
import { ReservationStatus as DomainReservationStatus } from '@modules/reservation/domain/reservation.types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Reservation, ReservationStatus } from '@prisma/client';

const mapStatus = (status: ReservationStatus): DomainReservationStatus => {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return DomainReservationStatus.CONFIRMED;
    case ReservationStatus.CANCELLED:
      return DomainReservationStatus.CANCELLED;
    case ReservationStatus.CLOSED:
      return DomainReservationStatus.CLOSED;
    default:
      throw new Error(`Unknown ReservationStatus: ${status}`);
  }
};

export const mapStatusFromEventName = (eventName: string): DomainReservationStatus => {
  switch (eventName) {
    case ReservationCancelledDomainEvent.name:
      return DomainReservationStatus.CANCELLED;
    case ReservationClosedDomainEvent.name:
      return DomainReservationStatus.CLOSED;
    default:
      throw new Error(`Unknown event name for ReservationStatus mapping: ${eventName}`);
  }
};

export const toEntity = (record: Reservation): ReservationEntity => {
  return new ReservationEntity({
    id: new UUID({ uuid: record.id }),
    createdAt: DateValueObject.fromDate(record.createdAt),
    props: {
      startingDate: DateValueObject.fromDate(record.startingDate),
      status: mapStatus(record.status),
      endingDate: DateValueObject.fromDate(record.endingDate),
      publicComment: record.publicComment ?? undefined,
      packId: new UUID({ uuid: record.packId }),
      userId: record.userId ? new UUID({ uuid: record.userId }) : undefined,
      reservationWishId: record.reservationWishId
        ? new UUID({ uuid: record.reservationWishId })
        : undefined,
      cost: new Integer({ value: record.cost }),
    },
  });
};

@Injectable()
export class ReservationRepository implements ReservationRepositoryPort {
  private readonly logger = new Logger(ReservationRepository.name);

  constructor(
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
  ) {}

  private buildMatchingConfirmedAndClosedReservationsFilter(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ) {
    return {
      AND: [
        { startingDate: { lt: endingDate.value } },
        { endingDate: { gt: startingDate.value } },
        { status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.CLOSED] } },
      ],
    };
  }

  async create(reservation: ReservationEntity): Promise<void> {
    await prisma.reservation.create({
      data: {
        id: reservation.id.uuid,
        status: reservation.status,
        createdAt: reservation.createdAt.value,
        startingDate: reservation.startingDate.value,
        endingDate: reservation.endingDate.value,
        publicComment: reservation.publicComment ?? null,
        packId: reservation.packId.uuid,
        userId: reservation.userId?.uuid ?? null,
        reservationWishId: reservation.reservationWishId?.uuid ?? null,
        cost: reservation.cost.value,
      },
    });

    await reservation.publishEvents(this.eventEmitter);
    this.logger.log(`Reservation created: ${reservation.id.uuid}`);
  }

  async existsByPackAndDate(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<boolean> {
    const count = await prisma.reservation.count({
      where: {
        packId: packId.uuid,
        ...this.buildMatchingConfirmedAndClosedReservationsFilter(startingDate, endingDate),
      },
    });

    return count > 0;
  }

  async findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]> {
    const packs = await prisma.pack.findMany({
      where: {
        reservations: {
          none: this.buildMatchingConfirmedAndClosedReservationsFilter(startingDate, endingDate),
        },
      },
    });
    return packs.map(({ id, label }) => ({ id: new UUID({ uuid: id }), label }));
  }

  async findConfirmedAndClosedReservationsByDateRange(
    startDate: DateValueObject,
    endDate: DateValueObject,
  ): Promise<PlanningReservationDto[]> {
    const reservations = await prisma.reservation.findMany({
      where: this.buildMatchingConfirmedAndClosedReservationsFilter(startDate, endDate),
      include: {
        user: true,
      },
    });

    return reservations.map((record) => {
      const entity = toEntity(record);
      return {
        id: entity.id,
        isCancelable: entity.isCancelable(),
        packId: entity.packId,
        status: mapStatus(entity.status),
        userId: entity.userId,
        startingDate: entity.startingDate,
        endingDate: entity.endingDate,
        publicComment: entity.publicComment,
      };
    });
  }

  async findById(id: UUID): Promise<ReservationEntity | null> {
    const reservation = await prisma.reservation.findUnique({
      where: { id: id.uuid },
    });

    if (!reservation) {
      return null;
    }

    return toEntity(reservation);
  }

  async update(reservation: ReservationEntity): Promise<void> {
    await prisma.reservation.update({
      where: { id: reservation.id.uuid },
      data: {
        status: reservation.status,
        cost: reservation.cost.value,
      },
    });

    await reservation.publishEvents(this.eventEmitter);
    this.logger.log(
      `Reservation updated: ${reservation.id.uuid} with status ${reservation.status} and cost ${reservation.cost.value}`,
    );
  }

  async findClosedAndConfirmedReservationsByPackId(
    packId: UUID,
  ): Promise<PackReservationWithDetails[]> {
    const reservations = await prisma.reservation.findMany({
      where: {
        packId: packId.uuid,
        status: {
          in: [ReservationStatus.CONFIRMED, ReservationStatus.CLOSED],
        },
      },
      include: {
        user: true,
        flightLog: true,
      },
      orderBy: {
        startingDate: 'desc',
      },
    });

    return reservations.map((reservation) => ({
      id: new UUID({ uuid: reservation.id }),
      startingDate: DateValueObject.fromDate(reservation.startingDate),
      endingDate: DateValueObject.fromDate(reservation.endingDate),
      publicComment: reservation.publicComment ?? undefined,
      userName: reservation.user
        ? `${reservation.user.firstName ?? ''} ${reservation.user.lastName ?? ''}`.trim() ||
          undefined
        : undefined,
      flightLog: reservation.flightLog
        ? {
            id: reservation.flightLog.id,
            flightsMinutes: reservation.flightLog.flightsMinutes,
            flightsCount: reservation.flightLog.flightsCount,
            publicComment: reservation.flightLog.publicComment ?? undefined,
            privateComment: reservation.flightLog.privateComment ?? undefined,
            createdAt: reservation.flightLog.createdAt,
          }
        : undefined,
    }));
  }
}
