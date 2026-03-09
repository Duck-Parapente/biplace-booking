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
  const effectiveCreatedAt = createdAt.interpretAsParisTime();

  if (eventType === ReservationCostEventType.CLOSE) {
    return calculateCloseCost(effectiveCreatedAt, startingDate);
  }

  if (eventType === ReservationCostEventType.CANCEL) {
    return calculateCancelCost(effectiveCreatedAt, createdAt, startingDate, now);
  }

  throw new Error(`Unsupported event type: ${eventType}`);
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
  // Check if reservation is in the algo's 6-day window at cancellation time
  const windowEntryTime = getWindowEntryTime(startingDate, now);
  if (!windowEntryTime) {
    return new Integer({ value: 0 });
  }

  // Determine when to start counting: creation time or window entry time
  const costStartTime = windowEntryTime.isBefore(createdAt) ? createdAt : windowEntryTime;

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

function getWindowEntryTime(
  startingDate: DateValueObject,
  now: DateValueObject,
): DateValueObject | null {
  // Calculate when this starting date FIRST entered the 6-day window
  // It enters as J+6, which is 6 days before the starting date at 20:00 Paris
  const sixDaysBefore = startingDate.startOfDayInUTC(-algorithmConfig.windowDays);
  const dateAtAlgoRun = new Date(sixDaysBefore.value);
  dateAtAlgoRun.setUTCHours(algorithmConfig.newDateOpeningHourParis, 0, 0, 0);
  const firstEntryTime = DateValueObject.fromDate(dateAtAlgoRun).convertFromParisTime();

  // If we're cancelling before the reservation entered the window, no cost
  if (now.isBefore(firstEntryTime)) {
    return null;
  }

  return firstEntryTime;
}
