import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
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
        id: pack.id.uuid,
        label: pack.label,
        flightsHours: pack.flightsHours ?? 0,
        flightsCount: pack.flightsCount ?? 0,
        owner: {
          connect: { id: pack.ownerId.uuid },
        },
      },
    });

    await pack.publishEvents(this.eventEmitter);
    this.logger.log(`Pack created: ${pack.id}`);
  }

  async findAll(): Promise<PackEntity[]> {
    const packs = await prisma.pack.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return packs.map((pack) => {
      const { id, ownerId, ...otherProps } = pack;
      return new PackEntity({
        id: new UUID({ uuid: id }),
        props: {
          ownerId: new UUID({ uuid: ownerId }),
          ...otherProps,
        },
      });
    });
  }
}
