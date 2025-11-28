import { DateValueObject } from '@libs/ddd/date.value-object';
import { TestBuilder } from "./test-builder"


export const testCaseThreeUsersLimitedChoices = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder('should attribute packs based on priority and conflict resolution 3');

  testBuilder.addWish("A", i++, createdAt, ['I', 'J', 'K'], 'I');
  testBuilder.addWish("A", i++, createdAt, ['I', 'J'], 'J');
  testBuilder.addWish("A", i++, createdAt, ['I', 'J', 'K'], 'K');

  return testBuilder.buildTest();
};
