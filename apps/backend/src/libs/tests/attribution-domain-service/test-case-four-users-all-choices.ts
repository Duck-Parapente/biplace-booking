import { DateValueObject } from '@libs/ddd/date.value-object';

import { TestBuilder } from './test-builder';

export const testCaseFourUsersAllChoices1 = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder(
    'should attribute packs to four users with all choices available',
  );

  testBuilder.addWish('A', i++, createdAt, ['I', 'J', 'K', 'L'], 'I');
  testBuilder.addWish('B', i++, createdAt, ['I', 'J', 'L'], 'J');
  testBuilder.addWish('C', i++, createdAt, ['I', 'J', 'K', 'L'], 'K');
  testBuilder.addWish('D', i++, createdAt, ['I', 'J', 'K', 'L'], 'L');

  return testBuilder.buildTest();
};

export const testCaseFourUsersSomeChoices1 = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder(
    'should leave lowest priority user unassigned when limited packs',
  );

  testBuilder.addWish('A', i++, createdAt, ['I', 'J', 'K'], 'K');
  testBuilder.addWish('B', i++, createdAt, ['I', 'J'], 'I');
  testBuilder.addWish('C', i++, createdAt, ['I', 'J'], 'J');
  testBuilder.addWish('D', i++, createdAt, ['I', 'J', 'K'], undefined);

  return testBuilder.buildTest();
};

export const testCaseFourUsersSomeChoices2 = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder(
    'should leave lowest priority user unassigned with different pack order',
  );

  testBuilder.addWish('A', i++, createdAt, ['I', 'J', 'K'], 'K');
  testBuilder.addWish('B', i++, createdAt, ['I', 'J'], 'I');
  testBuilder.addWish('C', i++, createdAt, ['I', 'J'], 'J');
  testBuilder.addWish('D', i++, createdAt, ['K', 'J', 'I'], undefined);

  return testBuilder.buildTest();
};

export const testCaseFourUsersSomeChoices3 = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder(
    'should avoid taking unpopular packs when everyone has many choices',
  );

  testBuilder.addWish('A', i++, createdAt, ['I', 'K', 'J', 'L', 'N'], 'I');
  testBuilder.addWish('B', i++, createdAt, ['I', 'K', 'J', 'L', 'N'], 'K');
  testBuilder.addWish('C', i++, createdAt, ['I', 'K', 'J', 'L', 'N'], 'J');
  testBuilder.addWish('D', i++, createdAt, ['I', 'K', 'J', 'L'], 'L');

  return testBuilder.buildTest();
};
