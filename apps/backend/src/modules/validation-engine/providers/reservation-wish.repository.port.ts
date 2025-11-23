import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Injectable, Logger } from '@nestjs/common';
import { ReservationWishStatus } from '@prisma/client';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { ReservationWishSummary } from '../domain/validation-engine.types';

@Injectable()
export class ReservationWishRepository implements ReservationWishRepositoryPort {
  private readonly logger = new Logger(ReservationWishRepository.name);

  async findPendingAndRefusedByStartingDate(
    startingDate: DateValueObject,
  ): Promise<ReservationWishSummary[]> {
    const reservationWishes = await prisma.reservationWish.findMany({
      where: {
        startingDate: startingDate.value,
        status: { in: [ReservationWishStatus.PENDING, ReservationWishStatus.REFUSED] },
      },
      include: {
        packChoices: true,
        createdBy: true,
      },
    });

    return reservationWishes.map(
      ({ id: uuid, packChoices, createdAt, publicComment, createdBy }) => ({
        id: new UUID({ uuid }),
        packChoices: packChoices.map(({ id }) => new UUID({ uuid: id })),
        createdAt: DateValueObject.fromDate(createdAt),
        publicComment,
        createdBy: {
          id: new UUID({ uuid: createdBy.id }),
          currentScore: createdBy.currentScore,
        },
      }),
    );
  }

  confirmReservationWish(reservationWishId: UUID): Promise<void> {
    this.logger.log(`Confirming reservation wish ${reservationWishId.uuid}`);
    throw new Error('Method not implemented.');
  }

  refuseReservationWish(_reservationWishId: UUID): Promise<void> {
    this.logger.log(`Refusing reservation wish ${_reservationWishId.uuid}`);
    throw new Error('Method not implemented.');
  }
}
