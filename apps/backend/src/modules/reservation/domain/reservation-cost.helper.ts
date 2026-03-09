import { algorithmConfig } from '@libs/config/algorithm.constants';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';

const THRESHOLD_TO_CEIL_IN_MINUTES = 55;

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
  const firstEntryTime = getFirstEntryTime(startingDate);
  const effectiveCreatedAt = createdAt.interpretAsParisTime();

  if (eventType === ReservationCostEventType.CLOSE) {
    return calculateCloseCost(effectiveCreatedAt, createdAt, firstEntryTime, startingDate);
  }

  if (eventType === ReservationCostEventType.CANCEL) {
    return calculateCancelCost(effectiveCreatedAt, createdAt, firstEntryTime, startingDate, now);
  }

  throw new Error(`Unsupported event type: ${eventType}`);
}

function calculateCloseCost(
  effectiveCreatedAt: DateValueObject,
  createdAt: DateValueObject,
  firstEntryTime: DateValueObject,
  startingDate: DateValueObject,
): Integer {
  const costStartTime = createdAt.isBefore(firstEntryTime)
    ? firstEntryTime.interpretAsParisTime()
    : effectiveCreatedAt;
  return calculateMaxAllowedCost(costStartTime, startingDate, 24);
}

function calculateCancelCost(
  effectiveCreatedAt: DateValueObject,
  createdAt: DateValueObject,
  firstEntryTime: DateValueObject,
  startingDate: DateValueObject,
  now: DateValueObject,
): Integer {
  if (now.isBefore(firstEntryTime)) {
    return new Integer({ value: 0 });
  }
  const costStartTime = firstEntryTime.isBefore(createdAt) ? createdAt : firstEntryTime;
  const maxAllowedCost = calculateMaxAllowedCost(effectiveCreatedAt, startingDate, 0);
  const hoursSinceStart = costStartTime.roundedUpHoursBetween(now, THRESHOLD_TO_CEIL_IN_MINUTES);
  return hoursSinceStart.min(maxAllowedCost);
}

function calculateMaxAllowedCost(
  effectiveCreatedAt: DateValueObject,
  startingDate: DateValueObject,
  minCost: number,
): Integer {
  const hoursToEndOfStartingDay = effectiveCreatedAt.roundedUpHoursBetween(
    startingDate.startOfDayInUTC(1),
    THRESHOLD_TO_CEIL_IN_MINUTES,
  );
  return hoursToEndOfStartingDay.max(new Integer({ value: minCost }));
}

function getFirstEntryTime(startingDate: DateValueObject): DateValueObject {
  const sixDaysBefore = startingDate.startOfDayInUTC(-algorithmConfig.windowDays);
  const dateAtAlgoRun = new Date(sixDaysBefore.value);
  dateAtAlgoRun.setUTCHours(algorithmConfig.newDateOpeningHourParis, 0, 0, 0);
  return DateValueObject.fromDate(dateAtAlgoRun).convertFromParisTime();
}
