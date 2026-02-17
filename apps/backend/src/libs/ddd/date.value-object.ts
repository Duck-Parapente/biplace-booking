import { Guard } from '@libs/guards/primitive.guard';
import {
  addDays,
  startOfDay,
  differenceInHours,
  isFuture,
  isBefore,
  parse,
  isValid,
} from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

import { ArgumentInvalidException } from '../exceptions/exceptions';

import { Integer } from './integer.value-object';
import { ValueObject } from './value-object.base';

const PARIS_TZ = 'Europe/Paris';

export interface DateProps {
  value: Date; // Always stored as UTC internally
}

export class DateValueObject extends ValueObject<DateProps> {
  get value(): Date {
    return this.props.value;
  }

  /* -------------------- Core Helpers -------------------- */

  private static ensureValid(date: Date) {
    if (!(date instanceof Date) || !isValid(date)) {
      throw new ArgumentInvalidException('Invalid Date instance');
    }
  }

  /* -------------------- Business Methods -------------------- */

  startOfDayInUTC(offset: number = 0): DateValueObject {
    const shifted = addDays(this.value, offset);
    const start = startOfDay(shifted); // UTC-safe because value is UTC
    return new DateValueObject({ value: start });
  }

  /**
   * Interpret the current date as Paris local time
   * and convert it to its true UTC instant.
   */
  interpretAsParisTime(): DateValueObject {
    const utcDate = fromZonedTime(this.value, PARIS_TZ);
    return new DateValueObject({ value: utcDate });
  }

  isInTheFuture(): boolean {
    return isFuture(this.value);
  }

  isBefore(other: DateValueObject): boolean {
    return isBefore(this.value, other.value);
  }

  completeHoursBetween(other: DateValueObject): Integer {
    return new Integer({
      value: differenceInHours(other.value, this.value),
    });
  }

  /* -------------------- Factories -------------------- */

  static now(): DateValueObject {
    return new DateValueObject({ value: new Date() });
  }

  /**
   * Expects YYYY-MM-DD
   * Interpreted as Paris local date at 00:00,
   * then converted to UTC.
   */
  static fromDateString(date: string): DateValueObject {
    if (Guard.isEmpty(date)) {
      throw new ArgumentInvalidException('Date string cannot be empty');
    }

    const parsed = parse(date, 'yyyy-MM-dd', new Date());

    if (!isValid(parsed)) {
      throw new ArgumentInvalidException(`Invalid date format '${date}', expected YYYY-MM-DD`);
    }

    // Treat as Paris local midnight
    const utcDate = fromZonedTime(parsed, PARIS_TZ);

    return new DateValueObject({ value: utcDate });
  }

  static fromDate(date: Date): DateValueObject {
    DateValueObject.ensureValid(date);
    return new DateValueObject({ value: new Date(date.getTime()) });
  }

  /**
   * Returns today's date in Paris (00:00 Paris → UTC)
   */
  static todayInParis(): DateValueObject {
    const parisNow = toZonedTime(new Date(), PARIS_TZ);
    const start = startOfDay(parisNow);
    const utc = fromZonedTime(start, PARIS_TZ);

    return new DateValueObject({ value: utc });
  }

  static currentHourInParis(): number {
    const parisNow = toZonedTime(new Date(), PARIS_TZ);
    return parisNow.getHours();
  }

  /* -------------------- Validation -------------------- */

  protected validate(props: DateProps): void {
    DateValueObject.ensureValid(props.value);
  }
}
