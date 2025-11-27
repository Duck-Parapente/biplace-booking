import { randomUUID } from 'crypto';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

const createUUID = (): UUID => {
  return new UUID({ uuid: randomUUID() });
};

export const testCaseTenUsersTenPacks = () => {
  const packI = { id: createUUID(), label: 'Pack I' };
  const packJ = { id: createUUID(), label: 'Pack J' };
  const packK = { id: createUUID(), label: 'Pack K' };
  const packL = { id: createUUID(), label: 'Pack L' };
  const packM = { id: createUUID(), label: 'Pack M' };
  const packN = { id: createUUID(), label: 'Pack N' };
  const packO = { id: createUUID(), label: 'Pack O' };
  const packP = { id: createUUID(), label: 'Pack P' };
  const packQ = { id: createUUID(), label: 'Pack Q' };
  const packR = { id: createUUID(), label: 'Pack R' };

  const userA = createUUID();
  const userB = createUUID();
  const userC = createUUID();
  const userD = createUUID();
  const userE = createUUID();
  const userF = createUUID();
  const userG = createUUID();
  const userH = createUUID();
  const userI = createUUID();
  const userJ = createUUID();

  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

  const wishA = createUUID();
  const wishB = createUUID();
  const wishC = createUUID();
  const wishD = createUUID();
  const wishE = createUUID();
  const wishF = createUUID();
  const wishG = createUUID();
  const wishH = createUUID();
  const wishI = createUUID();
  const wishJ = createUUID();

  return {
    name: 'should attribute packs based on priority and conflict resolution 5',
    availablePacks: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
    wishes: [
      {
        id: wishA,
        createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishB,
        createdBy: { id: userB, currentScore: 2, nickname: 'User B' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishC,
        createdBy: { id: userC, currentScore: 3, nickname: 'User C' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishD,
        createdBy: { id: userD, currentScore: 4, nickname: 'User D' },
        packChoices: [packI, packJ, packK, packL, packM, packO, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishE,
        createdBy: { id: userE, currentScore: 5, nickname: 'User E' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishF,
        createdBy: { id: userF, currentScore: 6, nickname: 'User F' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishG,
        createdBy: { id: userG, currentScore: 7, nickname: 'User G' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishH,
        createdBy: { id: userH, currentScore: 8, nickname: 'User H' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishI,
        createdBy: { id: userI, currentScore: 9, nickname: 'User I' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
        createdAt,
      },
      {
        id: wishJ,
        createdBy: { id: userJ, currentScore: 10, nickname: 'User J' },
        packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
        createdAt,
      },
    ],
    expectedAttributions: [
      { wishId: wishA, pack: packI },
      { wishId: wishB, pack: packJ },
      { wishId: wishC, pack: packK },
      { wishId: wishD, pack: packL },
      { wishId: wishE, pack: packM },
      { wishId: wishF, pack: packN },
      { wishId: wishG, pack: packO },
      { wishId: wishH, pack: packP },
      { wishId: wishI, pack: packQ },
      { wishId: wishJ, pack: packR },
    ],
    expectedUnassigned: [],
  };
};
