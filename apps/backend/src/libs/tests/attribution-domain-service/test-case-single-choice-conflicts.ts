import { DateValueObject } from '@libs/ddd/date.value-object';

import { createUUID } from '../helpers';

export const testCaseSingleChoiceConflicts = () => {
  const packI = { id: createUUID(), label: 'Pack I' };
  const packJ = { id: createUUID(), label: 'Pack J' };
  const packK = { id: createUUID(), label: 'Pack K' };

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
    name: 'should attribute packs based on priority and conflict resolution 6',
    availablePacks: [packI, packJ, packK],
    wishes: [
      {
        id: wishA,
        createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
        packChoices: [packK],
        createdAt,
      },
      {
        id: wishB,
        createdBy: { id: userB, currentScore: 2, nickname: 'User B' },
        packChoices: [packI, packJ, packK],
        createdAt,
      },
      {
        id: wishC,
        createdBy: { id: userC, currentScore: 3, nickname: 'User C' },
        packChoices: [packK],
        createdAt,
      },
      {
        id: wishD,
        createdBy: { id: userD, currentScore: 4, nickname: 'User D' },
        packChoices: [packI],
        createdAt,
      },
    ],
    expectedAttributions: [
      { wishId: wishA, pack: packK },
      { wishId: wishB, pack: packJ },
      { wishId: wishD, pack: packI },
    ],
    expectedUnassigned: [wishC],
  };
};
