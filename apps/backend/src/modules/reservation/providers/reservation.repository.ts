import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Injectable, Logger } from '@nestjs/common';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';

@Injectable()
export class ReservationRepository implements ReservationRepositoryPort {
  private readonly logger = new Logger(ReservationRepository.name);

  constructor() {}

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
}
