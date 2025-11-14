import { validate } from 'uuid';

import { ArgumentInvalidException } from '../exceptions/exceptions';

import { ValueObject } from './value-object.base';

/** Note:
 * Value Objects with multiple properties can contain
 * other Value Objects inside if needed.
 * */

export interface UuidProps {
  uuid: string;
}

export class UUID extends ValueObject<UuidProps> {
  get uuid(): string {
    return this.props.uuid;
  }

  protected validate({ uuid }: UuidProps): void {
    if (!validate(uuid)) throw new ArgumentInvalidException(`UUID is not valid: ${uuid}`);
  }
}
