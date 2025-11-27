import { DateValueObject } from '@libs/ddd/date.value-object';
import { TestBuilder } from "./test-builder"


export const testCaseTenUsersTenPacks = () => {
  const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));
  let i: number = 0;

  let testBuilder: TestBuilder = new TestBuilder('should attribute packs based on priority and conflict resolution 5');

  testBuilder.addWish("User A", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack I');
  testBuilder.addWish("User B", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack J');
  testBuilder.addWish("User C", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack K');
  testBuilder.addWish("User D", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack L');
  testBuilder.addWish("User E", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack M');
  testBuilder.addWish("User F", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack N');
  testBuilder.addWish("User G", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack O');
  testBuilder.addWish("User H", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack P');
  testBuilder.addWish("User I", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack Q');
  testBuilder.addWish("User J", i++, createdAt, ['Pack I', 'Pack J', 'Pack K', 'Pack L', 'Pack M', 'Pack N', 'Pack O', 'Pack P', 'Pack Q', 'Pack R'], 'Pack R');

  return testBuilder.buildTest();
}
