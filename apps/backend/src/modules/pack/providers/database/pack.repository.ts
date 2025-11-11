import { EVENT_EMITTER } from '@app.di-tokens';
import { prisma } from '@libs/database/prisma/prisma';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { PackEntity } from '@modules/pack/domain/pack.entity';
import { PackRepositoryPort } from '@modules/pack/domain/ports/pack.repository.port';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PackRepository implements PackRepositoryPort {
  private readonly logger = new Logger(PackRepository.name);

  constructor(
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
  ) {}

  async create(pack: PackEntity): Promise<void> {
    await prisma.pack.create({
      data: {
        id: pack.id,
        label: pack.label,
        flightsHours: pack.flightsHours ?? 0,
        flightsCount: pack.flightsCount ?? 0,
        owner: {
          connect: { id: pack.ownerId },
        },
      },
    });

    await pack.publishEvents(this.eventEmitter);
    this.logger.log(`Pack created: ${pack.id}`);
  }
}
