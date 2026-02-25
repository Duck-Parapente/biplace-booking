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
      name: 'closed a reservation where the cost should be rounded up to the next hour',
      eventType: ReservationCostEventType.CLOSE,
      createdAt: '2026-02-16T19:00:06Z',
      startingDate: '2026-02-22T00:00:00Z',
      now: '2026-02-22T13:20:00Z',
      expected: 148,
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
      name: 'cancelled a reservation created before the 6 days-window of algo',
      eventType: ReservationCostEventType.CANCEL,
      createdAt: '2024-02-20T15:00:00Z',
      startingDate: '2024-04-01T00:00:00Z',
      now: '2024-02-25T10:00:00Z',
      expected: 0,
    },
    {
      name: 'cancelled an old reservation created just before the 6 days-window of algo',
      eventType: ReservationCostEventType.CANCEL,
      createdAt: '2026-01-20T15:00:00Z',
      startingDate: '2026-03-01T00:00:00Z',
      now: '2026-02-23T18:59:00Z',
      expected: 0,
    },
    {
      name: 'cancelled an old reservation created in the 6 days-window of algo',
      eventType: ReservationCostEventType.CANCEL,
      createdAt: '2026-01-22T15:00:00Z',
      startingDate: '2026-03-01T00:00:00Z',
      now: '2026-02-23T23:00:00Z',
      expected: 4,
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
    {
      name: 'cancelled immediately after creation (0 hours)',
      eventType: ReservationCostEventType.CANCEL,
      createdAt: '2024-03-01T10:00:00Z',
      startingDate: '2024-03-03T00:00:00Z',
      now: '2024-03-01T10:01:00Z',
      expected: 0,
    },
    {
      name: 'cancelled late - cost capped at max allowed (hours until end of starting day)',
      eventType: ReservationCostEventType.CANCEL,
      createdAt: '2024-03-01T10:00:00Z',
      startingDate: '2024-03-02T00:00:00Z',
      now: '2024-03-05T10:00:00Z',
      expected: 37,
    },
    {
      name: 'cancelled exactly at max allowed cost boundary',
      eventType: ReservationCostEventType.CANCEL,
      createdAt: '2024-03-01T10:00:00Z',
      startingDate: '2024-03-02T00:00:00Z',
      now: '2024-03-02T00:00:00Z',
      expected: 14,
    },
    {
      name: 'closed a reservation in summer with Paris timezone (UTC+2)',
      eventType: ReservationCostEventType.CLOSE,
      createdAt: '2024-07-15T08:30:00Z',
      startingDate: '2024-07-16T00:00:00Z',
      now: '2024-07-16T07:51:00Z',
      expected: 37,
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
