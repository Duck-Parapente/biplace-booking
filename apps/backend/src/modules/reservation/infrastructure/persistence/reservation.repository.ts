import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
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
      packId: new UUID({ uuid: record.packId }),
      userId: record.userId ? new UUID({ uuid: record.userId }) : undefined,
      reservationWishId: record.reservationWishId
        ? new UUID({ uuid: record.reservationWishId })
        : undefined,
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
        AND: [
          { startingDate: { lt: endingDate.value } },
          { endingDate: { gt: startingDate.value } },
          { status: ReservationStatus.CONFIRMED },
        ],
      },
    });

    return count > 0;
  }

  async findConfirmedReservationsByDateRange(
    startDate: DateValueObject,
    endDate: DateValueObject,
  ): Promise<PlanningReservationDto[]> {
    const reservations = await prisma.reservation.findMany({
      where: {
        AND: [
          { startingDate: { lt: endDate.value } },
          { endingDate: { gt: startDate.value } },
          { status: ReservationStatus.CONFIRMED },
        ],
      },
      include: {
        user: true,
      },
    });

    return reservations.map((r) => ({
      id: new UUID({ uuid: r.id }),
      packId: new UUID({ uuid: r.packId }),
      status: mapStatus(r.status),
      userId: r.userId ? new UUID({ uuid: r.userId }) : undefined,
      startingDate: DateValueObject.fromDate(r.startingDate),
      endingDate: DateValueObject.fromDate(r.endingDate),
      publicComment: r.publicComment ?? undefined,
    }));
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

  async updateStatus(reservation: ReservationEntity): Promise<void> {
    await prisma.reservation.update({
      where: { id: reservation.id.uuid },
      data: {
        status: reservation.status,
      },
    });

    await reservation.publishEvents(this.eventEmitter);
    this.logger.log(`Reservation status updated: ${reservation.id.uuid} to ${reservation.status}`);
  }
}
