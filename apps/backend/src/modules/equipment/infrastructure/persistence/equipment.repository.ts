import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { EquipmentEntity } from '@modules/equipment/domain/equipment.entity';
import { EquipmentRepositoryPort } from '@modules/equipment/domain/ports/equipment.repository.port';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Equipment, User } from '@prisma/client';

type EquipmentWithHolder = Equipment & { currentHolder: User | null };

const holderName = (holder: User | null): string | null => {
  if (!holder) return null;
  const name = [holder.firstName, holder.lastName].filter(Boolean).join(' ').trim();
  return name || holder.email;
};

const toEntity = (equipment: EquipmentWithHolder): EquipmentEntity => {
  return new EquipmentEntity({
    id: new UUID({ uuid: equipment.id }),
    createdAt: DateValueObject.fromDate(equipment.createdAt),
    props: {
      label: equipment.label,
      order: equipment.order,
      currentHolderId: equipment.currentHolderId
        ? new UUID({ uuid: equipment.currentHolderId })
        : null,
      currentHolderName: holderName(equipment.currentHolder),
    },
  });
};

@Injectable()
export class EquipmentRepository implements EquipmentRepositoryPort {
  private readonly logger = new Logger(EquipmentRepository.name);

  constructor(
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
  ) {}

  async findAll(): Promise<EquipmentEntity[]> {
    const equipments = await prisma.equipment.findMany({
      orderBy: { order: 'asc' },
      include: { currentHolder: true },
    });
    return equipments.map(toEntity);
  }

  async findById(id: UUID): Promise<EquipmentEntity | null> {
    const equipment = await prisma.equipment.findUnique({
      where: { id: id.uuid },
      include: { currentHolder: true },
    });
    return equipment ? toEntity(equipment) : null;
  }

  async update(equipment: EquipmentEntity): Promise<void> {
    await prisma.equipment.update({
      where: { id: equipment.id.uuid },
      data: { currentHolderId: equipment.currentHolderId?.uuid ?? null },
    });

    await equipment.publishEvents(this.eventEmitter);
    this.logger.log(`Equipment updated: ${equipment.id.uuid}`);
  }
}
