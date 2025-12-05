import { Guard } from '@libs/guards/primitive.guard';

import { ArgumentInvalidException } from '../exceptions/exceptions';

import { Integer } from './integer.value-object';
import { ValueObject } from './value-object.base';

export interface DateProps {
  value: Date;
}

export class DateValueObject extends ValueObject<DateProps> {
  get value(): Date {
    return this.props.value;
  }

  startOfDayInUTC(offset: number = 0): DateValueObject {
    const startOfDay = new Date(this.props.value);
    startOfDay.setUTCDate(startOfDay.getUTCDate() + offset);
    startOfDay.setUTCHours(0, 0, 0, 0);
    return new DateValueObject({ value: startOfDay });
  }

  isInTheFuture(): boolean {
    return this.value > new Date();
  }

  isBefore(other: DateValueObject): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  daysBetween(other: DateValueObject): Integer {
    const diffMs = other.value.getTime() - this.value.getTime();
    return new Integer({ value: Math.round(diffMs / (1000 * 60 * 60 * 24)) });
  }

  static now(): DateValueObject {
    return DateValueObject.fromDate(new Date());
  }

  static fromDateString(date: string): DateValueObject {
    if (Guard.isEmpty(date)) {
      throw new ArgumentInvalidException('Date string cannot be empty');
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
      throw new ArgumentInvalidException(`Invalid date format '${date}', expected YYYY-MM-DD`);
    }

    const [year, month, day] = date.split('-').map(Number);

    // Validate calendar correctness
    const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    if (
      utcDate.getUTCFullYear() !== year ||
      utcDate.getUTCMonth() !== month - 1 ||
      utcDate.getUTCDate() !== day
    ) {
      throw new ArgumentInvalidException(`Invalid calendar date: ${date}`);
    }

    return new DateValueObject({ value: utcDate });
  }

  static fromDate(date: Date): DateValueObject {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new ArgumentInvalidException('Invalid Date instance');
    }

    // Check if date is in UTC by verifying minutes and seconds match ISO string ending with "Z"
    const iso = date.toISOString();
    if (!iso.endsWith('Z')) {
      throw new ArgumentInvalidException('Date must be in UTC');
    }

    return new DateValueObject({ value: date });
  }

  protected validate(props: DateProps): void {
    if (!(props.value instanceof Date) || isNaN(props.value.getTime())) {
      throw new ArgumentInvalidException('Invalid DateValueObject value');
    }
  }
}
