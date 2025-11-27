import { randomUUID } from 'crypto';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

const createUUID = (): UUID => {
  return new UUID({ uuid: randomUUID() });
};

export const testCaseThreeUsersAllChoices = () => {
  const packI = { id: createUUID(), label: 'Pack I' };
  const packJ = { id: createUUID(), label: 'Pack J' };
  const packK = { id: createUUID(), label: 'Pack K' };

  const userA = createUUID();
  const userB = createUUID();
  const userC = createUUID();

  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

  const wishA = createUUID();
  const wishB = createUUID();
  const wishC = createUUID();

  return {
    name: 'should attribute packs based on priority and conflict resolution 2',
    availablePacks: [packI, packJ, packK],
    wishes: [
      {
        id: wishA,
        createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
        packChoices: [packI, packJ, packK],
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
        packChoices: [packI, packJ, packK],
        createdAt,
      },
    ],
    expectedAttributions: [
      { wishId: wishA, pack: packI },
      { wishId: wishB, pack: packJ },
      { wishId: wishC, pack: packK },
    ],
    expectedUnassigned: [],
  };
};
