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
  context: 'CLASSIC' | 'TRAINING';
}

export const calculateReservationCost = ({
  eventType,
  createdAt,
  startingDate,
  context,
  now,
}: CalculateReservationCostParams): Integer => {
  if (context === 'TRAINING') {
    return new Integer({ value: eventType === ReservationCostEventType.CLOSE ? 24 : 0 });
  }

  if (context === 'CLASSIC') {
    return calculateClassicReservationCost({
      eventType,
      createdAt,
      startingDate,
      context,
      now,
    });
  }

  throw new Error(`Unsupported context: ${context}`);
};

const calculateClassicReservationCost = ({
  eventType,
  createdAt,
  startingDate,
  now = DateValueObject.now(),
}: CalculateReservationCostParams): Integer => {
  const firstEntryTime = getFirstEntryTime(startingDate);
  const effectiveCreatedAt = createdAt.interpretAsParisTime();

  if (eventType === ReservationCostEventType.CLOSE) {
    const costStart = createdAt.isBefore(firstEntryTime)
      ? firstEntryTime.interpretAsParisTime()
      : effectiveCreatedAt;
    const costEnd = startingDate.startOfDayInUTC(1);
    return computeHours(costStart, costEnd).max(new Integer({ value: 24 }));
  }

  if (eventType === ReservationCostEventType.CANCEL) {
    if (now.isBefore(firstEntryTime)) return new Integer({ value: 0 });
    const costStart = firstEntryTime.isBefore(createdAt) ? createdAt : firstEntryTime;
    const costEnd = now;
    const maxCost = computeHours(effectiveCreatedAt, startingDate.startOfDayInUTC(1)).max(
      new Integer({ value: 0 }),
    );
    return computeHours(costStart, costEnd).min(maxCost);
  }

  throw new Error(`Unsupported event type: ${eventType}`);
};

function computeHours(start: DateValueObject, end: DateValueObject): Integer {
  return start.roundedUpHoursBetween(end, THRESHOLD_TO_CEIL_IN_MINUTES);
}

function getFirstEntryTime(startingDate: DateValueObject): DateValueObject {
  const sixDaysBefore = startingDate.startOfDayInUTC(-algorithmConfig.windowDays);
  const dateAtAlgoRun = new Date(sixDaysBefore.value);
  dateAtAlgoRun.setUTCHours(algorithmConfig.newDateOpeningHourParis, 0, 0, 0);
  return DateValueObject.fromDate(dateAtAlgoRun).convertFromParisTime();
}
