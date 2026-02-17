import { DateValueObject } from '@libs/ddd/date.value-object';

import { calculateReservationCost, ReservationCostEventType } from './reservation-cost.helper';

describe('calculateReservationCost', () => {
  it.each([
    {
      name: 'cancelled a reservation 15 hours after creation',
      eventType: ReservationCostEventType.CANCEL,
      createdAt: '2024-03-01T19:00:00Z',
      startingDate: '2024-03-03T00:00:00Z',
      now: '2024-03-02T10:00:00Z',
      expected: 15,
    },
    {
      name: 'closed a reservation created after the starting date',
      eventType: ReservationCostEventType.CLOSE,
      createdAt: '2024-03-05T15:00:00Z',
      startingDate: '2024-03-01T00:00:00Z',
      now: '2024-03-07T10:00:00Z',
      expected: 24,
    },
    {
      name: 'cancelled a reservation created after the starting date',
      eventType: ReservationCostEventType.CANCEL,
      createdAt: '2024-03-05T15:00:00Z',
      startingDate: '2024-03-01T00:00:00Z',
      now: '2024-03-07T10:00:00Z',
      expected: 0,
    },
    {
      name: 'closed a reservation created for current day',
      eventType: ReservationCostEventType.CLOSE,
      createdAt: '2024-03-05T15:00:00Z',
      startingDate: '2024-03-05T00:00:00Z',
      now: '2024-03-07T10:00:00Z',
      expected: 24,
    },
    {
      name: 'closed a reservation and use Paris timezone for reservation creation',
      eventType: ReservationCostEventType.CLOSE,
      createdAt: '2024-02-16T08:30:00Z',
      startingDate: '2024-02-17T00:00:00Z',
      now: '2024-02-17T07:51:00Z',
      expected: 38,
    },
  ])('$name', ({ eventType, createdAt, startingDate, now, expected }) => {
    const result = calculateReservationCost({
      eventType,
      createdAt: DateValueObject.fromDate(new Date(createdAt)),
      startingDate: DateValueObject.fromDate(new Date(startingDate)),
      now: DateValueObject.fromDate(new Date(now)),
    });
    expect(result.value).toBe(expected);
  });
});
