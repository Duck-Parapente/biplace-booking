import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { PackSummary } from '@libs/types/accross-modules';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import {
  PackReservationsWithDetails,
  PlanningReservationDto,
} from '@modules/reservation/domain/reservation.types';
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

export const toEntity = (record: Reservation): ReservationEntity => {
  return new ReservationEntity({
    id: new UUID({ uuid: record.id }),
    createdAt: DateValueObject.fromDate(record.createdAt),
    props: {
      startingDate: DateValueObject.fromDate(record.startingDate),
      status: mapStatus(record.status),
      endingDate: DateValueObject.fromDate(record.endingDate),
      publicComment: record.publicComment ?? undefined,
      context: record.context,
      packId: new UUID({ uuid: record.packId }),
      userId: record.userId ? new UUID({ uuid: record.userId }) : undefined,
      reservationWishId: record.reservationWishId
        ? new UUID({ uuid: record.reservationWishId })
        : undefined,
      manualCost: record.manualCost !== null ? new Integer({ value: record.manualCost }) : null,
      automaticCost:
        record.automaticCost !== null ? new Integer({ value: record.automaticCost }) : null,
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
        context: reservation.context,
        publicComment: reservation.publicComment ?? null,
        packId: reservation.packId.uuid,
        userId: reservation.userId?.uuid ?? null,
        reservationWishId: reservation.reservationWishId?.uuid ?? null,
        automaticCost: reservation.automaticCost?.value ?? null,
        manualCost: reservation.manualCost?.value ?? null,
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
        context: entity.context,
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
        manualCost: reservation.manualCost?.value ?? null,
        automaticCost: reservation.automaticCost?.value ?? null,
      },
    });

    await reservation.publishEvents(this.eventEmitter);
    this.logger.log(
      `Reservation updated: ${reservation.id.uuid} with status ${reservation.status} and manualCost ${reservation.manualCost?.value ?? 'null'} and automaticCost ${reservation.automaticCost?.value ?? 'null'}`,
    );
  }

  async findAllReservationsByPackId(packId: UUID): Promise<PackReservationsWithDetails> {
    const [reservations, pack] = await Promise.all([
      prisma.reservation.findMany({
        where: {
          packId: packId.uuid,
        },
        include: {
          user: true,
          flightLog: true,
        },
        orderBy: {
          startingDate: 'desc',
        },
      }),
      prisma.pack.findUniqueOrThrow({
        where: { id: packId.uuid },
        include: {
          owner: true,
        },
      }),
    ]);

    const initialFlightsCount = new Integer({ value: pack.flightsCount });
    const initialFlightsMinutes = new Integer({ value: pack.flightsHours * 60 });

    const reservationFlightStats = reservations.reduce(
      (acc, reservation) => {
        if (reservation.flightLog) {
          return {
            totalMinutes: acc.totalMinutes + reservation.flightLog.flightsMinutes,
            totalCount: acc.totalCount + reservation.flightLog.flightsCount,
          };
        }
        return acc;
      },
      { totalMinutes: 0, totalCount: 0 },
    );

    const totalFlightsMinutes = initialFlightsMinutes.add(
      new Integer({ value: reservationFlightStats.totalMinutes }),
    );
    const totalFlightsCount = initialFlightsCount.add(
      new Integer({ value: reservationFlightStats.totalCount }),
    );

    return {
      packReservations: reservations.map((reservation) => ({
        id: new UUID({ uuid: reservation.id }),
        startingDate: DateValueObject.fromDate(reservation.startingDate),
        endingDate: DateValueObject.fromDate(reservation.endingDate),
        userName: reservation.user
          ? `${reservation.user.firstName ?? ''} ${reservation.user.lastName ?? ''}`.trim() ||
            reservation.user.email
          : undefined,
        status: mapStatus(reservation.status),
        manualCost:
          reservation.manualCost !== null ? new Integer({ value: reservation.manualCost }) : null,
        automaticCost:
          reservation.automaticCost !== null
            ? new Integer({ value: reservation.automaticCost })
            : null,
        flightLog: reservation.flightLog
          ? {
              flightTimeMinutes: new Integer({ value: reservation.flightLog.flightsMinutes }),
              flightsCount: new Integer({ value: reservation.flightLog.flightsCount }),
              publicComment: reservation.flightLog.publicComment ?? undefined,
            }
          : undefined,
      })),
      totalFlightsCount,
      totalFlightsMinutes,
      ownerFullName:
        [pack.owner.firstName, pack.owner.lastName].join(' ').trim() || pack.owner.email,
      description: pack.description ?? null,
      details: pack.details ?? null,
      lastControlDate: pack.lastControlDate ? DateValueObject.fromDate(pack.lastControlDate) : null,
      lastRescueFoldingDate: pack.lastRescueFoldingDate
        ? DateValueObject.fromDate(pack.lastRescueFoldingDate)
        : null,
      flightsMinutesSinceLastControlDate: pack.lastControlDate
        ? new Integer({
            value: reservations
              .filter(
                (r) =>
                  r.flightLog &&
                  r.startingDate >= pack.lastControlDate! &&
                  r.status !== ReservationStatus.CANCELLED,
              )
              .reduce((sum, r) => sum + (r.flightLog?.flightsMinutes ?? 0), 0),
          })
        : null,
    };
  }
}
