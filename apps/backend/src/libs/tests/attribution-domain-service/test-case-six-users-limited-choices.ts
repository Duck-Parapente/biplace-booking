import { DateValueObject } from '@libs/ddd/date.value-object';

import { TestBuilder } from './test-builder';

export const testCaseSixUsersLimitedChoices1 = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

  let testBuilder: TestBuilder = new TestBuilder(
    'should attribute packs based on priority and conflict resolution 7',
  );

  testBuilder.addWish('A', 1, createdAt, ['I', 'J', 'K'], 'J');
  testBuilder.addWish('B', 2, createdAt, ['I'], 'I');
  testBuilder.addWish('C', 3, createdAt, ['J', 'K'], 'K');
  testBuilder.addWish('D', 4, createdAt, ['I', 'J', 'L'], 'L');
  testBuilder.addWish('E', 5, createdAt, ['I', 'J', 'M'], 'M');
  testBuilder.addWish('F', 6, createdAt, ['K'], undefined);

  return testBuilder.buildTest();
};

// Le mm que le précédent mais dans le désordre
export const testCaseSixUsersLimitedChoices2 = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let testBuilder: TestBuilder = new TestBuilder(
    'should attribute packs based on priority and conflict resolution 9',
  );

  testBuilder.addWish('A', 1, createdAt, ['I', 'J', 'K'], 'J');
  testBuilder.addWish('B', 2, createdAt, ['I'], 'I');
  testBuilder.addWish('D', 4, createdAt, ['I', 'J', 'L'], 'L');
  testBuilder.addWish('C', 3, createdAt, ['J', 'K'], 'K');
  testBuilder.addWish('E', 5, createdAt, ['I', 'J', 'M'], 'M');
  testBuilder.addWish('F', 6, createdAt, ['K'], undefined);

  return testBuilder.buildTest();
};
