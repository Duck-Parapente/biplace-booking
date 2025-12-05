import { ArgumentInvalidException } from '../exceptions/exceptions';

import { ValueObject } from './value-object.base';

/** Note:
 * Value Objects with multiple properties can contain
 * other Value Objects inside if needed.
 * */

export interface IntegerProps {
  value: number;
}

export class Integer extends ValueObject<IntegerProps> {
  get value(): number {
    return this.props.value;
  }

  protected validate({ value }: IntegerProps): void {
    if (!Number.isInteger(value)) {
      throw new ArgumentInvalidException(`Value must be an integer: ${value}`);
    }
  }

  public static zero(): Integer {
    return new Integer({ value: 0 });
  }

  public add(other: Integer): Integer {
    return new Integer({ value: this.value + other.value });
  }

  public subtract(other: Integer): Integer {
    return new Integer({ value: this.value - other.value });
  }

  public isGreaterThan(other: Integer): boolean {
    return this.value > other.value;
  }

  public isLessThan(other: Integer): boolean {
    return this.value < other.value;
  }

  public isEqualTo(other: Integer): boolean {
    return this.value === other.value;
  }
}
