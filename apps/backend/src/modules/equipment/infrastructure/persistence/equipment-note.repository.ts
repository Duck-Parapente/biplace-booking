import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { EquipmentNoteEntity } from '@modules/equipment/domain/equipment-note.entity';
import { EquipmentNoteRepositoryPort } from '@modules/equipment/domain/ports/equipment-note.repository.port';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EquipmentNote } from '@prisma/client';

const toEntity = (equipmentNote: EquipmentNote): EquipmentNoteEntity => {
  return new EquipmentNoteEntity({
    id: new UUID({ uuid: equipmentNote.id }),
    createdAt: DateValueObject.fromDate(equipmentNote.createdAt),
    props: {
      equipmentId: new UUID({ uuid: equipmentNote.equipmentId }),
      content: equipmentNote.content,
      createdById: new UUID({ uuid: equipmentNote.createdById }),
    },
  });
};

@Injectable()
export class EquipmentNoteRepository implements EquipmentNoteRepositoryPort {
  private readonly logger = new Logger(EquipmentNoteRepository.name);

  constructor(
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
  ) {}

  async create(equipmentNote: EquipmentNoteEntity): Promise<void> {
    await prisma.equipmentNote.create({
      data: {
        id: equipmentNote.id.uuid,
        createdAt: equipmentNote.createdAt.value,
        content: equipmentNote.content,
        equipment: { connect: { id: equipmentNote.equipmentId.uuid } },
        createdBy: { connect: { id: equipmentNote.createdById.uuid } },
      },
    });

    await equipmentNote.publishEvents(this.eventEmitter);
    this.logger.log(`EquipmentNote created: ${equipmentNote.id.uuid}`);
  }

  async findById(noteId: UUID): Promise<EquipmentNoteEntity | null> {
    const equipmentNote = await prisma.equipmentNote.findUnique({
      where: { id: noteId.uuid },
    });
    return equipmentNote ? toEntity(equipmentNote) : null;
  }

  async findByEquipmentId(equipmentId: UUID): Promise<EquipmentNoteEntity[]> {
    const equipmentNotes = await prisma.equipmentNote.findMany({
      where: { equipmentId: equipmentId.uuid },
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true },
    });
    return equipmentNotes.map(toEntity);
  }

  async update(equipmentNote: EquipmentNoteEntity): Promise<void> {
    await prisma.equipmentNote.update({
      where: { id: equipmentNote.id.uuid },
      data: { content: equipmentNote.content },
    });
    this.logger.log(`EquipmentNote updated: ${equipmentNote.id.uuid}`);
  }
}
