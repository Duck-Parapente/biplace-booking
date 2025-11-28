import { DateValueObject } from '@libs/ddd/date.value-object';
import { TestBuilder } from "./test-builder"

export const testCaseThreeUsersAllChoices = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder('should attribute packs based on priority and conflict resolution 8');

  testBuilder.addWish("A", i++, createdAt, ['I', 'J', 'K'], 'I');
  testBuilder.addWish("B", i++, createdAt, ['I', 'J', 'K'], 'J');
  testBuilder.addWish("C", i++, createdAt, ['I', 'J', 'K'], 'K');

  return testBuilder.buildTest();
};
