import { prisma } from '@libs/database/prisma/prisma';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { PackNoteEntity } from '@modules/pack/domain/pack-note.entity';
import { PackNoteRepositoryPort } from '@modules/pack/domain/ports/pack-note.repository.port';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PackNote } from '@prisma/client';

const toEntity = (packNote: PackNote): PackNoteEntity => {
  return new PackNoteEntity({
    id: new UUID({ uuid: packNote.id }),
    createdAt: DateValueObject.fromDate(packNote.createdAt),
    props: {
      packId: new UUID({ uuid: packNote.packId }),
      content: packNote.content,
      createdById: new UUID({ uuid: packNote.createdById }),
    },
  });
};

@Injectable()
export class PackNoteRepository implements PackNoteRepositoryPort {
  private readonly logger = new Logger(PackNoteRepository.name);

  constructor(
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
  ) {}

  async create(packNote: PackNoteEntity): Promise<void> {
    await prisma.packNote.create({
      data: {
        id: packNote.id.uuid,
        createdAt: packNote.createdAt.value,
        content: packNote.content,
        pack: { connect: { id: packNote.packId.uuid } },
        createdBy: { connect: { id: packNote.createdById.uuid } },
      },
    });

    await packNote.publishEvents(this.eventEmitter);
    this.logger.log(`PackNote created: ${packNote.id.uuid}`);
  }

  async findById(noteId: UUID): Promise<PackNoteEntity | null> {
    const packNote = await prisma.packNote.findUnique({
      where: { id: noteId.uuid },
    });
    return packNote ? toEntity(packNote) : null;
  }

  async findByPackId(packId: UUID): Promise<PackNoteEntity[]> {
    const packNotes = await prisma.packNote.findMany({
      where: { packId: packId.uuid },
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true },
    });
    return packNotes.map(toEntity);
  }

  async update(packNote: PackNoteEntity): Promise<void> {
    await prisma.packNote.update({
      where: { id: packNote.id.uuid },
      data: { content: packNote.content },
    });
    this.logger.log(`PackNote updated: ${packNote.id.uuid}`);
  }
}
