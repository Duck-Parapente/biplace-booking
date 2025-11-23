import { randomUUID } from 'crypto';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { AttributionDomainService } from './attibution.domain-service';
import { BaseValidationEngineProps } from './validation-engine.types';

const createUUID = (): UUID => {
  return new UUID({ uuid: randomUUID() });
};

const packI = createUUID();
const packJ = createUUID();
const packK = createUUID();
const packL = createUUID();
const packM = createUUID();

const userA = createUUID();
const userB = createUUID();
const userC = createUUID();
const userD = createUUID();
const userE = createUUID();
const userF = createUUID();

// Mock the uuid module to avoid ES module issues
jest.mock('uuid', () => ({
  validate: jest.fn(() => true),
}));

describe('AttributionDomainService', () => {
  let service: AttributionDomainService;

  beforeEach(() => {
    service = new AttributionDomainService();
  });

  describe('attributePacks', () => {
    const testCases = [
      {
        name: 'should attribute packs based on priority and conflict resolution',
        setup: () => {
          const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

          const wishD = createUUID();
          const wishE = createUUID();
          const wishF = createUUID();
          const wishB = createUUID();
          const wishC = createUUID();
          const wishA = createUUID();

          return {
            availablePacks: [packI, packJ, packK, packL, packM],
            wishes: [
              { id: wishD, userId: userD, userScore: 600, packChoices: [packK], createdAt },
              {
                id: wishE,
                userId: userE,
                userScore: 500,
                packChoices: [packI, packJ, packL],
                createdAt,
              },
              {
                id: wishF,
                userId: userF,
                userScore: 400,
                packChoices: [packI, packJ, packM],
                createdAt,
              },
              { id: wishB, userId: userB, userScore: 200, packChoices: [packI], createdAt },
              { id: wishC, userId: userC, userScore: 100, packChoices: [packJ, packK], createdAt },
              {
                id: wishA,
                userId: userA,
                userScore: 50,
                packChoices: [packI, packJ, packK],
                createdAt,
              },
            ],
            expectedAttributions: [
              { wishId: wishD, packId: packK },
              { wishId: wishE, packId: packL },
              { wishId: wishF, packId: packM },
              { wishId: wishB, packId: packI },
              { wishId: wishC, packId: packJ },
            ],
            expectedUnassigned: [wishA],
          };
        },
      },
      {
        name: 'should prioritize older wish when userScore is equal',
        setup: () => {
          const olderDate = new Date('2025-11-20T08:00:00Z');
          const newerDate = new Date('2025-11-20T12:00:00Z');

          const wishOlder = createUUID();
          const wishNewer = createUUID();

          return {
            availablePacks: [packI],
            wishes: [
              {
                id: wishNewer,
                userId: userA,
                userScore: 100,
                packChoices: [packI],
                createdAt: DateValueObject.fromDate(newerDate),
              },
              {
                id: wishOlder,
                userId: userB,
                userScore: 100,
                packChoices: [packI],
                createdAt: DateValueObject.fromDate(olderDate),
              },
            ],
            expectedAttributions: [{ wishId: wishOlder, packId: packI }],
            expectedUnassigned: [wishNewer],
          };
        },
      },
    ];

    testCases.forEach(({ name, setup }) => {
      it(name, async () => {
        const { availablePacks, wishes, expectedAttributions, expectedUnassigned } = setup();

        const props: BaseValidationEngineProps = {
          availablePacks,
          reservationWishes: wishes,
        };

        const result = await service.attributePacks(props);

        expect(result).toHaveLength(expectedAttributions.length);

        expectedAttributions.forEach(({ wishId, packId }) => {
          expect(result).toContainEqual({
            reservationWishId: wishId,
            assignedPackId: packId,
          });
        });

        expectedUnassigned.forEach((wishId) => {
          expect(
            result.find(({ reservationWishId }) => reservationWishId === wishId),
          ).toBeUndefined();
        });
      });
    });
  });
});
