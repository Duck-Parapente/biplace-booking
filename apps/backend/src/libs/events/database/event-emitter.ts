import { prisma } from '@libs/database/prisma/prisma';
import { DomainEvent } from '@libs/ddd';
import { Injectable, Logger } from '@nestjs/common';

import { EventEmitterPort } from '../domain/event-emitter.port';

@Injectable()
export class EventEmitter implements EventEmitterPort {
  private readonly logger = new Logger(EventEmitter.name);

  async logDomainEvent(domainEvent: DomainEvent): Promise<void> {
    const { aggregateId, metadata, ...payload } = domainEvent;
    await prisma.event.create({
      data: {
        aggregateId: aggregateId.uuid,
        name: domainEvent.constructor.name,
        payload,
        metadata,
      },
    });
  }
}
