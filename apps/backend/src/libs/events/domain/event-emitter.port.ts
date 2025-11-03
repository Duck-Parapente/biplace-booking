import { DomainEvent } from '@libs/ddd';

export interface EventEmitterPort {
  logDomainEvent(domainEvent: DomainEvent): Promise<void>;
}
