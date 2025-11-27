import { DateValueObject } from '@libs/ddd/date.value-object';

import { createUUID } from '../helpers';

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
