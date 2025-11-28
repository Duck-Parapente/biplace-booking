import { DateValueObject } from '@libs/ddd/date.value-object';

import { TestBuilder } from './test-builder';

export const testCasePriorityConflictResolution = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder(
    'should attribute packs based on priority and conflict resolution 5',
  );

  testBuilder.addWish('D', i++, createdAt, ['K'], 'K');
  testBuilder.addWish('E', i++, createdAt, ['I', 'J', 'L'], 'L');
  testBuilder.addWish('F', i++, createdAt, ['I', 'J', 'M'], 'M');
  testBuilder.addWish('B', i++, createdAt, ['I'], 'I');
  testBuilder.addWish('C', i++, createdAt, ['J', 'K'], 'J');
  testBuilder.addWish('A', i++, createdAt, ['I', 'J', 'K'], undefined);

  return testBuilder.buildTest();
};
