import { randomUUID } from 'crypto';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

const createUUID = (): UUID => {
  return new UUID({ uuid: randomUUID() });
};

export const testCaseUnwantedPack = () => {
  const packI = { id: createUUID(), label: 'Pack I' };
  const packJ = { id: createUUID(), label: 'Pack J' };

  const userA = createUUID();

  const mainWish = createUUID();

  return {
    name: 'should not attribute an unwanted pack',
    availablePacks: [packJ],
    wishes: [
      {
        id: mainWish,
        packChoices: [packI],
        createdBy: { id: userA, currentScore: 100, nickname: 'User A' },
        createdAt: DateValueObject.fromDate(new Date('2025-11-20T08:00:00Z')),
      },
    ],
    expectedAttributions: [],
    expectedUnassigned: [mainWish],
  };
};
