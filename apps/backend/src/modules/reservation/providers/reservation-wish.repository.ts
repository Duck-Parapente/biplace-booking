import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import { ReservationWishEntity } from '@modules/reservation/domain/reservation-wish.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ReservationWish, ReservationWishStatus } from '@prisma/client';

import { ReservationWishStatus as DomainReservationWishStatus } from '../domain/reservation.types';

const mapStatus = (status: ReservationWishStatus): DomainReservationWishStatus => {
  switch (status) {
    case ReservationWishStatus.PENDING:
      return DomainReservationWishStatus.PENDING;
    case ReservationWishStatus.CONFIRMED:
      return DomainReservationWishStatus.CONFIRMED;
    case ReservationWishStatus.CANCELLED:
      return DomainReservationWishStatus.CANCELLED;
    default:
      throw new Error(`Unknown ReservationWishStatus: ${status}`);
  }
};

const toEntity = (
  record: ReservationWish & { packChoices: { id: string }[] },
): ReservationWishEntity => {
  return new ReservationWishEntity({
    id: new UUID({ uuid: record.id }),
    createdAt: DateValueObject.fromDate(record.createdAt),
    props: {
      createdById: new UUID({ uuid: record.createdById }),
      status: mapStatus(record.status),
      startingDate: DateValueObject.fromDate(record.startingDate),
      endingDate: DateValueObject.fromDate(record.endingDate),
      packChoices: record.packChoices.map(
        (packChoice: { id: string }) => new UUID({ uuid: packChoice.id }),
      ),
      publicComment: record.publicComment,
    },
  });
};

@Injectable()
export class ReservationWishRepository implements ReservationWishRepositoryPort {
  private readonly logger = new Logger(ReservationWishRepository.name);

  constructor(
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
  ) {}

  async create(reservationWish: ReservationWishEntity): Promise<void> {
    await prisma.reservationWish.create({
      data: {
        id: reservationWish.id.uuid,
        createdAt: reservationWish.createdAt.value,
        startingDate: reservationWish.startingDate.value,
        endingDate: reservationWish.endingDate.value,
        publicComment: reservationWish.publicComment,
        status: reservationWish.status,
        packChoices: {
          connect: reservationWish.packChoices.map(({ uuid: id }) => ({ id })),
        },
        createdBy: {
          connect: { id: reservationWish.createdById.uuid },
        },
      },
    });

    await reservationWish.publishEvents(this.eventEmitter);
    this.logger.log(`ReservationWish created: ${reservationWish.id.uuid}`);
  }

  async existsPendingForStartingDateAndUser(startingDate, userId): Promise<boolean> {
    const count = await prisma.reservationWish.count({
      where: {
        startingDate: startingDate.value,
        createdById: userId.uuid,
        status: ReservationWishStatus.PENDING,
      },
    });

    return count > 0;
  }

  async findById(reservationWishId: UUID): Promise<ReservationWishEntity | null> {
    const record = await prisma.reservationWish.findUnique({
      where: { id: reservationWishId.uuid },
      include: { packChoices: true },
    });

    if (!record) {
      return null;
    }

    return toEntity(record);
  }

  async update(reservationWish: ReservationWishEntity): Promise<void> {
    await prisma.reservationWish.update({
      where: { id: reservationWish.id.uuid },
      data: {
        status: reservationWish.status,
      },
    });

    await reservationWish.publishEvents(this.eventEmitter);
    this.logger.log(`ReservationWish updated: ${reservationWish.id.uuid}`);
  }

  async findAllForUser(userId: UUID): Promise<ReservationWishEntity[]> {
    const records = await prisma.reservationWish.findMany({
      where: {
        createdById: userId.uuid,
      },
      include: { packChoices: true },
    });

    return records.map(toEntity);
  }
}
