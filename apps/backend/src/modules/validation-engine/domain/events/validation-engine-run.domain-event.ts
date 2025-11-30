import { DomainEvent, DomainEventProps } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';

import { BaseValidationEngineProps, Attribution } from '../validation-engine.types';

export class ValidationEngineRunDomainEvent extends DomainEvent {
  readonly engineInput: BaseValidationEngineProps;
  readonly attributions: Attribution[];
  readonly startingDate: DateValueObject;
  readonly endingDate: DateValueObject;

  constructor(props: DomainEventProps<ValidationEngineRunDomainEvent>) {
    super(props);
    this.engineInput = props.engineInput;
    this.attributions = props.attributions;
    this.startingDate = props.startingDate;
    this.endingDate = props.endingDate;
  }
}
