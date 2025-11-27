import { randomUUID } from 'crypto';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

const createUUID = (): UUID => {
  return new UUID({ uuid: randomUUID() });
};

export const testCasePriorityConflictResolution = () => {
  const packI = { id: createUUID(), label: 'Pack I' };
  const packJ = { id: createUUID(), label: 'Pack J' };
  const packK = { id: createUUID(), label: 'Pack K' };
  const packL = { id: createUUID(), label: 'Pack L' };
  const packM = { id: createUUID(), label: 'Pack M' };

  const userA = createUUID();
  const userB = createUUID();
  const userC = createUUID();
  const userD = createUUID();
  const userE = createUUID();
  const userF = createUUID();

  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

  const wishD = createUUID();
  const wishE = createUUID();
  const wishF = createUUID();
  const wishB = createUUID();
  const wishC = createUUID();
  const wishA = createUUID();

  return {
    name: 'should attribute packs based on priority and conflict resolution',
    availablePacks: [packI, packJ, packK, packL, packM],
    wishes: [
      {
        id: wishD,
        createdBy: { id: userD, currentScore: 50, nickname: 'User D' },
        packChoices: [packK],
        createdAt,
      },
      {
        id: wishE,
        packChoices: [packI, packJ, packL],
        createdAt,
        createdBy: { id: userE, currentScore: 100, nickname: 'User E' },
      },
      {
        id: wishF,
        packChoices: [packI, packJ, packM],
        createdAt,
        createdBy: { id: userF, currentScore: 200, nickname: 'User F' },
      },
      {
        id: wishB,
        createdBy: { id: userB, currentScore: 400, nickname: 'User B' },
        packChoices: [packI],
        createdAt,
      },
      {
        id: wishC,
        createdBy: { id: userC, currentScore: 500, nickname: 'User C' },
        packChoices: [packJ, packK],
        createdAt,
      },
      {
        id: wishA,
        packChoices: [packI, packJ, packK],
        createdAt,
        createdBy: { id: userA, currentScore: 600, nickname: 'User A' },
      },
    ],
    expectedAttributions: [
      { wishId: wishD, pack: packK },
      { wishId: wishE, pack: packL },
      { wishId: wishF, pack: packM },
      { wishId: wishB, pack: packI },
      { wishId: wishC, pack: packJ },
    ],
    expectedUnassigned: [wishA],
  };
};
