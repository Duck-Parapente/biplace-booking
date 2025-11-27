import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Reservation, ReservationWishStatus } from '@prisma/client';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { ReservationEntity } from '../domain/reservation.entity';
import { PlanningData } from '../domain/reservation.types';

export const toEntity = (record: Reservation): ReservationEntity => {
  return new ReservationEntity({
    id: new UUID({ uuid: record.id }),
    createdAt: DateValueObject.fromDate(record.createdAt),
    props: {
      startingDate: DateValueObject.fromDate(record.startingDate),
      endingDate: DateValueObject.fromDate(record.endingDate),
      publicComment: record.publicComment,
      packId: new UUID({ uuid: record.packId }),
      userId: new UUID({ uuid: record.userId }),
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
        createdAt: reservation.createdAt.value,
        startingDate: reservation.startingDate.value,
        endingDate: reservation.endingDate.value,
        publicComment: reservation.publicComment ?? null,
        packId: reservation.packId.uuid,
        userId: reservation.userId.uuid,
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
          { startingDate: { lte: endingDate.value } },
          { endingDate: { gte: startingDate.value } },
        ],
      },
    });

    return count > 0;
  }

  async findPlanningData(
    startDate: DateValueObject,
    endDate: DateValueObject,
  ): Promise<PlanningData[]> {
    // Get all packs
    const packs = await prisma.pack.findMany({
      select: {
        id: true,
        label: true,
      },
    });

    // Get all reservations in the date range
    const reservations = await prisma.reservation.findMany({
      where: {
        AND: [{ startingDate: { lte: endDate.value } }, { endingDate: { gte: startDate.value } }],
      },
      include: {
        user: true,
      },
    });

    // Get all pending wishes in the date range
    const pendingWishes = await prisma.reservationWish.findMany({
      where: {
        startingDate: {
          gte: startDate.value,
          lte: endDate.value,
        },
        status: ReservationWishStatus.PENDING,
      },
      include: {
        packChoices: true,
      },
    });

    // Generate all dates in the range
    const dates: Date[] = [];
    const currentDate = new Date(startDate.value);
    const endDateTime = endDate.value.getTime();

    while (currentDate.getTime() <= endDateTime) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Build planning data grouped by date
    const planningData: PlanningData[] = [];

    for (const date of dates) {
      const packsForDate = packs.map((pack) => {
        // Find reservation for this pack on this date
        const reservation = reservations.find(
          (r) => r.packId === pack.id && r.startingDate <= date && r.endingDate >= date,
        );

        // Count pending wishes for this pack on this date
        const pendingWishesCount = pendingWishes.filter(
          (w) =>
            w.startingDate.getTime() === date.getTime() &&
            w.packChoices.some((pc) => pc.id === pack.id),
        ).length;

        return {
          packId: { uuid: pack.id },
          packLabel: pack.label,
          pendingWishesCount,
          reservation: reservation
            ? {
                username:
                  reservation.user.firstName && reservation.user.lastName
                    ? `${reservation.user.firstName} ${reservation.user.lastName}`
                    : reservation.user.email,
                comment: reservation.publicComment,
              }
            : null,
        };
      });

      planningData.push({
        date: DateValueObject.fromDate(date),
        packs: packsForDate,
      });
    }

    return planningData;
  }
}
