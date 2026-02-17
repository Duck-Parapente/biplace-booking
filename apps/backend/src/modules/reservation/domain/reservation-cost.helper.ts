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
  if (eventType === ReservationCostEventType.CLOSE) {
    return calculateCloseCost(createdAt, startingDate);
  }

  return calculateCancelCost(createdAt, startingDate, now);
}

function calculateCloseCost(createdAt: DateValueObject, startingDate: DateValueObject): Integer {
  const effectiveCreatedAt = createdAt.interpretAsParisTime();
  const maxAllowedCost = calculateMaxAllowedCost(effectiveCreatedAt, startingDate, 24);
  return maxAllowedCost;
}

function calculateCancelCost(
  createdAt: DateValueObject,
  startingDate: DateValueObject,
  now: DateValueObject,
): Integer {
  const maxAllowedCost = calculateMaxAllowedCost(createdAt, startingDate, 0);
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
