import { randomUUID } from 'crypto';

import { Guard } from '@libs/guards/primitive.guard';

import { ArgumentNotProvidedException } from '../exceptions';

import { UUID } from './uuid.value-object';

type DomainEventMetadata = {
  /** Timestamp when this domain event occurred */
  readonly timestamp: number;

  /** ID for correlation purposes (for Integration Events,logs correlation, etc).
   */
  readonly correlationId: string;

  /**
   * Causation id used to reconstruct execution order if needed
   */
  readonly causationId?: string;

  /**
   * User ID for debugging and logging purposes
   */
  readonly userId?: string;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: UUID;
  metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
  public readonly id: string;

  /** Aggregate ID where domain event occurred */
  public readonly aggregateId: UUID;

  public readonly metadata: DomainEventMetadata;

  constructor(props: DomainEventProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException('DomainEvent props should not be empty');
    }
    this.id = randomUUID();
    this.aggregateId = props.aggregateId;
    this.metadata = {
      correlationId: props?.metadata?.correlationId,
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || Date.now(),
      userId: props?.metadata?.userId,
    };
  }
}
