import { DateValueObject } from '@libs/ddd/date.value-object';

import { TestBuilder } from './test-builder';

export const testCaseSingleChoiceConflicts = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder(
    'should attribute packs based on priority and conflict resolution 6',
  );

  testBuilder.addWish('A', i++, createdAt, ['K'], 'K');
  testBuilder.addWish('B', i++, createdAt, ['I', 'J', 'K'], 'J');
  testBuilder.addWish('C', i++, createdAt, ['K'], undefined);
  testBuilder.addWish('D', i++, createdAt, ['I'], 'I');

  return testBuilder.buildTest();
};
