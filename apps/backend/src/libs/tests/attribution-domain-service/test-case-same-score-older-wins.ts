import { randomUUID } from 'crypto';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

const createUUID = (): UUID => {
  return new UUID({ uuid: randomUUID() });
};

export const testCaseSameScoreOlderWins = () => {
  const packI = { id: createUUID(), label: 'Pack I' };

  const userA = createUUID();
  const userB = createUUID();

  const olderDate = new Date('2025-11-20T08:00:00Z');
  const newerDate = new Date('2025-11-20T12:00:00Z');

  const wishOlder = createUUID();
  const wishNewer = createUUID();

  return {
    name: 'should prioritize older wish when userScore is equal',
    availablePacks: [packI],
    wishes: [
      {
        id: wishNewer,
        packChoices: [packI],
        createdBy: { id: userA, currentScore: 100, nickname: 'User A' },
        createdAt: DateValueObject.fromDate(newerDate),
      },
      {
        id: wishOlder,
        packChoices: [packI],
        createdBy: { id: userB, currentScore: 100, nickname: 'User B' },
        createdAt: DateValueObject.fromDate(olderDate),
      },
    ],
    expectedAttributions: [{ wishId: wishOlder, pack: packI }],
    expectedUnassigned: [wishNewer],
  };
};
