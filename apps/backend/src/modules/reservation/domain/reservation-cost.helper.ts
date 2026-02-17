import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';

export enum ReservationCostEventType {
  CANCEL = 'cancel',
  CLOSE = 'close',
}

interface CalculateReservationCostParams {
  eventType: ReservationCostEventType;
  createdAt: DateValueObject;
  startingDate: DateValueObject;
  now: DateValueObject;
}

export function calculateReservationCost({
  eventType,
  createdAt,
  startingDate,
  now = DateValueObject.now(),
}: CalculateReservationCostParams): Integer {
  const effectiveCreatedAt = createdAt.interpretAsParisTime();

  if (eventType === ReservationCostEventType.CLOSE) {
    return calculateCloseCost(effectiveCreatedAt, startingDate);
  }

  return calculateCancelCost(effectiveCreatedAt, createdAt, startingDate, now);
}

function calculateCloseCost(
  effectiveCreatedAt: DateValueObject,
  startingDate: DateValueObject,
): Integer {
  return calculateMaxAllowedCost(effectiveCreatedAt, startingDate, 24);
}

function calculateCancelCost(
  effectiveCreatedAt: DateValueObject,
  createdAt: DateValueObject,
  startingDate: DateValueObject,
  now: DateValueObject,
): Integer {
  const maxAllowedCost = calculateMaxAllowedCost(effectiveCreatedAt, startingDate, 0);
  const hoursSinceCreation = createdAt.completeHoursBetween(now);
  return hoursSinceCreation.min(maxAllowedCost);
}

function calculateMaxAllowedCost(
  effectiveCreatedAt: DateValueObject,
  startingDate: DateValueObject,
  minCost: number,
): Integer {
  const hoursToEndOfStartingDay = effectiveCreatedAt.completeHoursBetween(
    startingDate.startOfDayInUTC(1),
  );
  return hoursToEndOfStartingDay.max(new Integer({ value: minCost }));
}
