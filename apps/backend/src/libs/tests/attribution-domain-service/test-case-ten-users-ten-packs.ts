import { DateValueObject } from '@libs/ddd/date.value-object';

import { TestBuilder } from './test-builder';

export const testCaseTenUsersTenPacks = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder(
    'should attribute first choice to all users when enough packs',
  );

  testBuilder.addWish('A', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'I');
  testBuilder.addWish('B', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'J');
  testBuilder.addWish('C', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'K');
  testBuilder.addWish('D', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'L');
  testBuilder.addWish('E', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'M');
  testBuilder.addWish('F', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'N');
  testBuilder.addWish('G', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'O');
  testBuilder.addWish('H', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'P');
  testBuilder.addWish('I', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'Q');
  testBuilder.addWish('J', i++, createdAt, ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], 'R');

  return testBuilder.buildTest();
};
