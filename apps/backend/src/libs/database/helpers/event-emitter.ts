import { prisma } from '@libs/database/prisma/prisma';
import { DomainEvent } from '@libs/ddd';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { EventEmitterPort } from '../../events/domain/event-emitter.port';

@Injectable()
export class EventEmitter implements EventEmitterPort {
  private readonly logger = new Logger(EventEmitter.name);

  constructor(private readonly eventBus: EventBus) {}

  async logDomainEvent(domainEvent: DomainEvent): Promise<void> {
    this.eventBus.publish(domainEvent);

    const { id, aggregateId, metadata, ...payload } = domainEvent;
    await prisma.event.create({
      data: {
        id: id.uuid,
        aggregateId: aggregateId.uuid,
        name: domainEvent.constructor.name,
        payload,
        metadata: {
          ...metadata,
          userId: metadata.userId?.uuid ?? undefined,
        },
      },
    });

    this.logger.debug(
      `Event ${domainEvent.constructor.name} logged to database and published to bus`,
    );
  }
}
