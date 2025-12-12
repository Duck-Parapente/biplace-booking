import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';
import { ReservationCancelledDomainEvent } from '@modules/reservation/domain/events/reservation-cancelled.domain-event';
import { ReservationClosedDomainEvent } from '@modules/reservation/domain/events/reservation-closed.domain-event';
import { ReservationUpdatedDomainEvent } from '@modules/reservation/domain/events/reservation-updated.domain-event';
import { ReservationWishStatusUpdatedDomainEvent } from '@modules/reservation/domain/events/reservation-wish-updated.domain-event';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import {
  PENDING_STATUSES,
  ReservationWishEntity,
} from '@modules/reservation/domain/reservation-wish.entity';
import {
  ReservationWishStatus as DomainReservationWishStatus,
  ReservationWishWithReservation,
} from '@modules/reservation/domain/reservation-wish.types';
import { ReservationStatus as DomainReservationStatus } from '@modules/reservation/domain/reservation.types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ReservationWish, ReservationWishStatus } from '@prisma/client';

import { mapStatusFromEventName, toEntity as toReservationEntity } from './reservation.repository';

const mapStatus = (status: ReservationWishStatus): DomainReservationWishStatus => {
  switch (status) {
    case ReservationWishStatus.PENDING:
      return DomainReservationWishStatus.PENDING;
    case ReservationWishStatus.CONFIRMED:
      return DomainReservationWishStatus.CONFIRMED;
    case ReservationWishStatus.CANCELLED:
      return DomainReservationWishStatus.CANCELLED;
    case ReservationWishStatus.REFUSED:
      return DomainReservationWishStatus.REFUSED;
    default:
      throw new Error(`Unknown ReservationWishStatus: ${status}`);
  }
};

const toEntity = (
  record: ReservationWish & {
    packChoices: { pack: { id: string }; order: number }[];
  },
): ReservationWishEntity => {
  return new ReservationWishEntity({
    id: new UUID({ uuid: record.id }),
    createdAt: DateValueObject.fromDate(record.createdAt),
    props: {
      userId: new UUID({ uuid: record.userId }),
      status: mapStatus(record.status),
      startingDate: DateValueObject.fromDate(record.startingDate),
      endingDate: DateValueObject.fromDate(record.endingDate),
      packChoices: record.packChoices.map((pc) => new UUID({ uuid: pc.pack.id })),
      publicComment: record.publicComment ?? undefined,
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
          create: reservationWish.packChoices.map(({ uuid: id }, index) => ({
            packId: id,
            order: index,
          })),
        },
        user: {
          connect: { id: reservationWish.userId.uuid },
        },
      },
    });

    await reservationWish.publishEvents(this.eventEmitter);
    this.logger.log(`ReservationWish created: ${reservationWish.id.uuid}`);
  }

  async existsNotCancelledForStartingDateAndUser(
    startingDate: DateValueObject,
    userId: UUID,
  ): Promise<boolean> {
    const count = await prisma.reservationWish.count({
      where: {
        startingDate: startingDate.value,
        userId: userId.uuid,
        status: { not: ReservationWishStatus.CANCELLED },
      },
    });

    return count > 0;
  }

  async findById(reservationWishId: UUID): Promise<ReservationWishEntity | null> {
    const record = await prisma.reservationWish.findUnique({
      where: { id: reservationWishId.uuid },
      include: {
        packChoices: {
          include: { pack: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!record) {
      return null;
    }

    return toEntity(record);
  }

  async updateStatus(reservationWish: ReservationWishEntity): Promise<void> {
    await prisma.reservationWish.update({
      where: { id: reservationWish.id.uuid },
      data: {
        status: reservationWish.status,
      },
    });

    await reservationWish.publishEvents(this.eventEmitter);
    this.logger.log(`ReservationWish updated: ${reservationWish.id.uuid}`);
  }

  async findAllForUser(userId: UUID): Promise<ReservationWishWithReservation[]> {
    const records = await prisma.reservationWish.findMany({
      where: {
        userId: userId.uuid,
      },
      include: {
        reservation: true,
        packChoices: {
          include: { pack: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    const allWishStatusEvents = await prisma.event.findMany({
      where: {
        aggregateId: { in: records.map(({ id }) => id) },
        name: ReservationWishStatusUpdatedDomainEvent.name,
      },
    });

    const allReservationsEvents = await prisma.event.findMany({
      where: {
        aggregateId: {
          in: records.map((r) => r.reservation?.id).filter((id): id is string => !!id),
        },
        name: {
          in: [
            ReservationCancelledDomainEvent.name,
            ReservationClosedDomainEvent.name,
            ReservationUpdatedDomainEvent.name,
          ],
        },
      },
    });

    return records.map((record) => ({
      reservationWish: {
        entity: toEntity(record),
        events: [
          {
            status: DomainReservationWishStatus.PENDING,
            date: DateValueObject.fromDate(record.createdAt),
          },
          ...allWishStatusEvents
            .filter(({ aggregateId }) => aggregateId === record.id)
            .map(({ payload, createdAt }) => {
              const payloadTyped = payload as { status: string };
              return {
                status: payloadTyped.status as DomainReservationWishStatus,
                date: DateValueObject.fromDate(createdAt),
              };
            })
            .filter((event) => event.status !== DomainReservationWishStatus.CONFIRMED),
        ],
      },
      reservation: record.reservation
        ? {
            entity: toReservationEntity(record.reservation),
            events: [
              {
                status: DomainReservationStatus.CONFIRMED,
                cost: Integer.zero(),
                date: DateValueObject.fromDate(record.reservation.createdAt),
              },
              ...allReservationsEvents
                .filter(({ aggregateId }) => aggregateId === record.reservation?.id)
                .map(({ createdAt, name, payload }) => {
                  const payloadTyped = payload as { cost: { props: { value: number } } };

                  return {
                    status: mapStatusFromEventName(name),
                    cost: new Integer({ value: payloadTyped.cost.props.value }),
                    date: DateValueObject.fromDate(createdAt),
                  };
                }),
            ],
          }
        : null,
    }));
  }

  async findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishForAttribution[]> {
    const reservationWishes = await prisma.reservationWish.findMany({
      where: {
        startingDate: startingDate.value,
        status: { in: PENDING_STATUSES },
      },
      include: {
        packChoices: {
          include: { pack: true },
          orderBy: { order: 'asc' },
        },
        user: true,
      },
    });

    return reservationWishes.map(({ id: uuid, packChoices, createdAt, publicComment, user }) => ({
      id: new UUID({ uuid }),
      packChoices: packChoices.map(({ pack, order }) => ({
        id: new UUID({ uuid: pack.id }),
        label: pack.label,
        order: new Integer({ value: order }),
      })),
      createdAt: DateValueObject.fromDate(createdAt),
      publicComment: publicComment ?? undefined,
      user: {
        id: new UUID({ uuid: user.id }),
        nickname:
          user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        currentScore: user.currentScore,
      },
    }));
  }

  async findPendingWishesByDateRange(startDate: DateValueObject, endDate: DateValueObject) {
    const pendingWishes = await prisma.reservationWish.findMany({
      where: {
        startingDate: {
          gte: startDate.value,
          lte: endDate.value,
        },
        status: { in: PENDING_STATUSES },
      },
      include: {
        packChoices: {
          include: { pack: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return pendingWishes.map((w) => ({
      startingDate: DateValueObject.fromDate(w.startingDate),
      packChoices: w.packChoices.map((pc) => new UUID({ uuid: pc.pack.id })),
      endingDate: DateValueObject.fromDate(w.endingDate),
      status: mapStatus(w.status),
      publicComment: w.publicComment ?? undefined,
      userId: new UUID({ uuid: w.userId }),
    }));
  }
}
