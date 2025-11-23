import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { UpdateReservationWishService } from '@modules/reservation/commands/update-reservation-wish.service';
import { Injectable, Logger } from '@nestjs/common';
import { ReservationWishStatus } from '@prisma/client';

import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { ReservationWishSummary } from '../domain/validation-engine.types';

@Injectable()
export class ReservationWishRepository implements ReservationWishRepositoryPort {
  private readonly logger = new Logger(ReservationWishRepository.name);

  constructor(readonly updateReservationWishService: UpdateReservationWishService) {}

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

  async confirmReservationWish(reservationWishId: UUID): Promise<void> {
    await this.updateReservationWishService.confirmReservationWish(reservationWishId);
  }

  async refuseReservationWish(reservationWishId: UUID): Promise<void> {
    await this.updateReservationWishService.refuseReservationWish(reservationWishId);
  }
}
