import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Injectable, Logger } from '@nestjs/common';

import { PackRepositoryPort } from '../domain/ports/pack.repository.port';
import { PackSummary } from '../domain/validation-engine.types';

@Injectable()
export class PackRepository implements PackRepositoryPort {
  private readonly logger = new Logger(PackRepository.name);

  async findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]> {
    const packs = await prisma.pack.findMany({
      where: {
        reservations: {
          none: {
            OR: [
              {
                AND: [
                  { startingDate: { lte: endingDate.value } },
                  { endingDate: { gte: startingDate.value } },
                ],
              },
            ],
          },
        },
      },
    });
    return packs.map(({ id: uuid }) => ({
      id: new UUID({ uuid }),
    }));
  }
}
