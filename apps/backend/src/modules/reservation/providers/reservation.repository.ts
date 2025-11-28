import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Reservation } from '@prisma/client';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { ReservationEntity } from '../domain/reservation.entity';
import { ReservationProps } from '../domain/reservation.types';

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

  async findReservationsByDateRange(
    startDate: DateValueObject,
    endDate: DateValueObject,
  ): Promise<ReservationProps[]> {
    const reservations = await prisma.reservation.findMany({
      where: {
        AND: [{ startingDate: { lte: endDate.value } }, { endingDate: { gte: startDate.value } }],
      },
      include: {
        user: true,
      },
    });

    return reservations.map((r) => ({
      packId: new UUID({ uuid: r.packId }),
      userId: new UUID({ uuid: r.userId }),
      startingDate: DateValueObject.fromDate(r.startingDate),
      endingDate: DateValueObject.fromDate(r.endingDate),
      publicComment: r.publicComment,
    }));
  }
}
