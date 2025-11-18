import { prisma } from '@libs/database/prisma/prisma';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import { ReservationWishEntity } from '@modules/reservation/domain/reservation-wish.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';

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
        startingDate: reservationWish.startingDate.value,
        endingDate: reservationWish.endingDate.value,
        packChoices: {
          connect: reservationWish.packChoices.map(({ uuid: id }) => ({ id })),
        },
        createdById: reservationWish.createdById.uuid,
        publicComment: reservationWish.publicComment,
      },
    });

    await reservationWish.publishEvents(this.eventEmitter);
    this.logger.log(`ReservationWish created: ${reservationWish.id.uuid}`);
  }
}
