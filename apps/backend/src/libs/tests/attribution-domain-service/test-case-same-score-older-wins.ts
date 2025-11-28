import { DateValueObject } from '@libs/ddd/date.value-object';

import { TestBuilder } from './test-builder';

export const testCaseSameScoreOlderWins1 = () => {
  const olderDate = DateValueObject.fromDate(new Date('2025-11-20T08:00:00Z'));
  const newerDate = DateValueObject.fromDate(new Date('2025-11-20T12:00:00Z'));

  let testBuilder: TestBuilder = new TestBuilder(
    'should prioritize older wish when userScore is equal - newer first',
  );

  testBuilder.addWish('A', 42, newerDate, ['I'], undefined);
  testBuilder.addWish('B', 42, olderDate, ['I'], 'I');

  return testBuilder.buildTest();
};

export const testCaseSameScoreOlderWins2 = () => {
  const olderDate = DateValueObject.fromDate(new Date('2025-11-20T08:00:00Z'));
  const newerDate = DateValueObject.fromDate(new Date('2025-11-20T12:00:00Z'));

  let testBuilder: TestBuilder = new TestBuilder(
    'should prioritize older wish when userScore is equal - older first',
  );

  testBuilder.addWish('A', 42, olderDate, ['I'], 'I');
  testBuilder.addWish('B', 42, newerDate, ['I'], undefined);

  return testBuilder.buildTest();
};
