import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { Logger } from '@nestjs/common';

import { DomainEvent } from './domain-event.base';
import { Entity } from './entity.base';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  protected logger = new Logger(this.constructor.name);
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public async publishEvents(emitter: EventEmitterPort): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (event) => {
        this.logger.log(
          `"${event.constructor.name}" event published for aggregate ${this.constructor.name} : ${this.id.uuid}`,
        );
        await emitter.logDomainEvent(event);
      }),
    );
    this.clearEvents();
  }
}
