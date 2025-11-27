import { DateValueObject } from '@libs/ddd/date.value-object';

import { createUUID } from '../helpers';

export const testCaseFourUsersAllChoices = () => {
  const packI = { id: createUUID(), label: 'Pack I' };
  const packJ = { id: createUUID(), label: 'Pack J' };
  const packK = { id: createUUID(), label: 'Pack K' };
  const packL = { id: createUUID(), label: 'Pack L' };

  const userA = createUUID();
  const userB = createUUID();
  const userC = createUUID();
  const userD = createUUID();

  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

  const wishA = createUUID();
  const wishB = createUUID();
  const wishC = createUUID();
  const wishD = createUUID();

  return {
    name: 'should attribute packs based on priority and conflict resolution 4',
    availablePacks: [packI, packJ, packK, packL],
    wishes: [
      {
        id: wishA,
        createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
        packChoices: [packI, packJ, packK, packL],
        createdAt,
      },
      {
        id: wishB,
        createdBy: { id: userB, currentScore: 2, nickname: 'User B' },
        packChoices: [packI, packJ, packL],
        createdAt,
      },
      {
        id: wishC,
        createdBy: { id: userC, currentScore: 3, nickname: 'User C' },
        packChoices: [packI, packJ, packK, packL],
        createdAt,
      },
      {
        id: wishD,
        createdBy: { id: userD, currentScore: 4, nickname: 'User D' },
        packChoices: [packI, packJ, packK, packL],
        createdAt,
      },
    ],
    expectedAttributions: [
      { wishId: wishA, pack: packI },
      { wishId: wishB, pack: packJ },
      { wishId: wishC, pack: packK },
      { wishId: wishD, pack: packL },
    ],
    expectedUnassigned: [],
  };
};
