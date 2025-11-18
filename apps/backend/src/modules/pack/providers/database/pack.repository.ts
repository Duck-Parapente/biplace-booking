import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { PackEntity } from '@modules/pack/domain/pack.entity';
import { PackRepositoryPort } from '@modules/pack/domain/ports/pack.repository.port';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pack } from '@prisma/client';

const toEntity = (pack: Pack): PackEntity => {
  const { id, ownerId, ...otherProps } = pack;
  return new PackEntity({
    id: new UUID({ uuid: id }),
    props: {
      ownerId: new UUID({ uuid: ownerId }),
      ...otherProps,
    },
  });
};

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
    this.logger.log(`Pack created: ${pack.id.uuid}`);
  }

  async findAll(): Promise<PackEntity[]> {
    const packs = await prisma.pack.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return packs.map(toEntity);
  }

  async findById(id: UUID): Promise<PackEntity | null> {
    const pack = await prisma.pack.findUnique({
      where: { id: id.uuid },
    });
    if (!pack) {
      return null;
    }
    return toEntity(pack);
  }

  async update(pack: PackEntity): Promise<void> {
    await prisma.pack.update({
      where: { id: pack.id.uuid },
      data: {
        label: pack.label,
        flightsHours: pack.flightsHours,
        flightsCount: pack.flightsCount,
        ownerId: pack.ownerId.uuid,
      },
    });

    await pack.publishEvents(this.eventEmitter);
    this.logger.log(`Pack updated: ${pack.id.uuid}`);
  }
}
