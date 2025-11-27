import { randomUUID } from 'crypto';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { AttributionDomainService } from './attribution.domain-service';
import { BaseValidationEngineProps } from './validation-engine.types';

const createUUID = (): UUID => {
  return new UUID({ uuid: randomUUID() });
};

const packI = { id: createUUID(), label: 'Pack I' };
const packJ = { id: createUUID(), label: 'Pack J' };
const packK = { id: createUUID(), label: 'Pack K' };
const packL = { id: createUUID(), label: 'Pack L' };
const packM = { id: createUUID(), label: 'Pack M' };
const packN = { id: createUUID(), label: 'Pack N' };
const packO = { id: createUUID(), label: 'Pack O' };
const packP = { id: createUUID(), label: 'Pack P' };
const packQ = { id: createUUID(), label: 'Pack Q' };
const packR = { id: createUUID(), label: 'Pack R' };

const userA = createUUID();
const userB = createUUID();
const userC = createUUID();
const userD = createUUID();
const userE = createUUID();
const userF = createUUID();
const userG = createUUID();
const userH = createUUID();
const userI = createUUID();
const userJ = createUUID();

// Mock the uuid module to avoid ES module issues
jest.mock('uuid', () => ({
  validate: jest.fn(() => true),
}));

describe('AttributionDomainService', () => {
  let service: AttributionDomainService;

  beforeEach(() => {
    service = new AttributionDomainService();
  });

  const printDebugInfo = (
    testName: string,
    wishes,
    availablePacks,
    result,
    expectedAttributions,
    expectedUnassigned,
  ): string => {
    const lines: string[] = [];

    lines.push(`\n=== Debug for failing test: ${testName} ===`);
    lines.push('Wishes submitted (ordered by score desc):');
    wishes
      .sort((a, b) => b.createdBy.currentScore - a.createdBy.currentScore)
      .forEach((wish) => {
        lines.push(
          `  - ${wish.createdBy.nickname} (score: ${wish.createdBy.currentScore}): ${wish.packChoices.map((p) => p.label).join(', ')}`,
        );
      });

    lines.push('\nActual attributions:');
    result.forEach((attr) => {
      const wish = wishes.find((w) => w.id === attr.reservationWishId);
      const pack = availablePacks.find((p) => p.id === attr.assignedPackId);
      if (wish && pack) {
        lines.push(`  - ${wish.createdBy.nickname} → ${pack.label}`);
      }
    });

    lines.push('\nExpected attributions:');
    expectedAttributions.forEach(({ wishId, pack }) => {
      const wish = wishes.find((w) => w.id === wishId);
      if (wish) {
        lines.push(`  - ${wish.createdBy.nickname} → ${pack.label}`);
      }
    });

    lines.push('\nUnassigned wishes:');
    const assignedWishIds = new Set(result.map((r) => r.reservationWishId));
    wishes.forEach((wish) => {
      if (!assignedWishIds.has(wish.id)) {
        lines.push(
          `  - ${wish.createdBy.nickname} (expected: ${expectedUnassigned.includes(wish.id) ? 'YES' : 'NO'})`,
        );
      }
    });
    lines.push('===========================\n');

    return lines.join('\n');
  };

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
              {
                id: wishD,
                createdBy: { id: userD, currentScore: 50, nickname: 'User D' },
                packChoices: [packK],
                createdAt,
              },
              {
                id: wishE,
                packChoices: [packI, packJ, packL],
                createdAt,
                createdBy: { id: userE, currentScore: 100, nickname: 'User E' },
              },
              {
                id: wishF,
                packChoices: [packI, packJ, packM],
                createdAt,
                createdBy: { id: userF, currentScore: 200, nickname: 'User F' },
              },
              {
                id: wishB,
                createdBy: { id: userB, currentScore: 400, nickname: 'User B' },
                packChoices: [packI],
                createdAt,
              },
              {
                id: wishC,
                createdBy: { id: userC, currentScore: 500, nickname: 'User C' },
                packChoices: [packJ, packK],
                createdAt,
              },
              {
                id: wishA,
                packChoices: [packI, packJ, packK],
                createdAt,
                createdBy: { id: userA, currentScore: 600, nickname: 'User A' },
              },
            ],
            expectedAttributions: [
              { wishId: wishD, pack: packK },
              { wishId: wishE, pack: packL },
              { wishId: wishF, pack: packM },
              { wishId: wishB, pack: packI },
              { wishId: wishC, pack: packJ },
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
                packChoices: [packI],
                createdBy: { id: userA, currentScore: 100, nickname: 'User A' },
                createdAt: DateValueObject.fromDate(newerDate),
              },
              {
                id: wishOlder,
                packChoices: [packI],
                createdBy: { id: userB, currentScore: 100, nickname: 'User B' },
                createdAt: DateValueObject.fromDate(olderDate),
              },
            ],
            expectedAttributions: [{ wishId: wishOlder, pack: packI }],
            expectedUnassigned: [wishNewer],
          };
        },
      },
      {
        name: 'should attribute packs based on priority and conflict resolution 2',
        setup: () => {
          const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

          const wishA = createUUID();
          const wishB = createUUID();
          const wishC = createUUID();

          return {
            availablePacks: [packI, packJ, packK],
            wishes: [
              {
                id: wishA,
                createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
                packChoices: [packI, packJ, packK],
                createdAt,
              },
              {
                id: wishB,
                createdBy: { id: userB, currentScore: 2, nickname: 'User B' },
                packChoices: [packI, packJ, packK],
                createdAt,
              },
              {
                id: wishC,
                createdBy: { id: userC, currentScore: 3, nickname: 'User C' },
                packChoices: [packI, packJ, packK],
                createdAt,
              },
            ],
            expectedAttributions: [
              { wishId: wishA, pack: packI },
              { wishId: wishB, pack: packJ },
              { wishId: wishC, pack: packK },
            ],
            expectedUnassigned: [],
          };
        },
      },
      {
        name: 'should attribute packs based on priority and conflict resolution 3',
        setup: () => {
          const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

          const wishA = createUUID();
          const wishB = createUUID();
          const wishC = createUUID();

          return {
            availablePacks: [packI, packJ, packK],
            wishes: [
              {
                id: wishA,
                createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
                packChoices: [packI, packJ, packK],
                createdAt,
              },
              {
                id: wishB,
                createdBy: { id: userB, currentScore: 2, nickname: 'User B' },
                packChoices: [packI, packJ],
                createdAt,
              },
              {
                id: wishC,
                createdBy: { id: userC, currentScore: 3, nickname: 'User C' },
                packChoices: [packI, packJ, packK],
                createdAt,
              },
            ],
            expectedAttributions: [
              { wishId: wishA, pack: packI },
              { wishId: wishB, pack: packJ },
              { wishId: wishC, pack: packK },
            ],
            expectedUnassigned: [],
          };
        },
      },
      {
        name: 'should attribute packs based on priority and conflict resolution 4',
        setup: () => {
          const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

          const wishA = createUUID();
          const wishB = createUUID();
          const wishC = createUUID();
          const wishD = createUUID();

          return {
            availablePacks: [packI, packJ, packK, packL],
            wishes: [
              {
                id: wishA,
                createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
                packChoices: [packI, packJ, packK, packL],
                createdAt,
              },
              {
                id: wishB,
                createdBy: { id: userB, currentScore: 2, nickname: 'User B' },
                packChoices: [packI, packJ, packL],
                createdAt,
              },
              {
                id: wishC,
                createdBy: { id: userC, currentScore: 3, nickname: 'User C' },
                packChoices: [packI, packJ, packK, packL],
                createdAt,
              },
              {
                id: wishD,
                createdBy: { id: userD, currentScore: 4, nickname: 'User D' },
                packChoices: [packI, packJ, packK, packL],
                createdAt,
              },
            ],
            expectedAttributions: [
              { wishId: wishA, pack: packI },
              { wishId: wishB, pack: packJ },
              { wishId: wishC, pack: packK },
              { wishId: wishD, pack: packL },
            ],
            expectedUnassigned: [],
          };
        },
      },
      {
        name: 'should attribute packs based on priority and conflict resolution 5',
        setup: () => {
          const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

          const wishA = createUUID();
          const wishB = createUUID();
          const wishC = createUUID();
          const wishD = createUUID();
          const wishE = createUUID();
          const wishF = createUUID();
          const wishG = createUUID();
          const wishH = createUUID();
          const wishI = createUUID();
          const wishJ = createUUID();

          return {
            availablePacks: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR,],
            wishes: [
              {
                id: wishA,
                createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishB,
                createdBy: { id: userB, currentScore: 2, nickname: 'User B' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishC,
                createdBy: { id: userC, currentScore: 3, nickname: 'User C' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishD,
                createdBy: { id: userD, currentScore: 4, nickname: 'User D' },
                packChoices: [packI, packJ, packK, packL, packM, packO, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishE,
                createdBy: { id: userE, currentScore: 5, nickname: 'User E' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishF,
                createdBy: { id: userF, currentScore: 6, nickname: 'User F' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishG,
                createdBy: { id: userG, currentScore: 7, nickname: 'User G' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishH,
                createdBy: { id: userH, currentScore: 8, nickname: 'User H' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishI,
                createdBy: { id: userI, currentScore: 9, nickname: 'User I' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
                createdAt,
              },
              {
                id: wishJ,
                createdBy: { id: userJ, currentScore: 10, nickname: 'User J' },
                packChoices: [packI, packJ, packK, packL, packM, packN, packO, packP, packQ, packR],
                createdAt,
              },
            ],
            expectedAttributions: [
              { wishId: wishA, pack: packI },
              { wishId: wishB, pack: packJ },
              { wishId: wishC, pack: packK },
              { wishId: wishD, pack: packL },
              { wishId: wishE, pack: packM },
              { wishId: wishF, pack: packN },
              { wishId: wishG, pack: packO },
              { wishId: wishH, pack: packP },
              { wishId: wishI, pack: packQ },
              { wishId: wishJ, pack: packR },
            ],
            expectedUnassigned: [],
          };
        },
      },
      {
        name: 'should attribute packs based on priority and conflict resolution 6',
        setup: () => {
          const createdAt = DateValueObject.fromDate(new Date('2025-11-20T10:00:00Z'));

          const wishA = createUUID();
          const wishB = createUUID();
          const wishC = createUUID();
          const wishD = createUUID();

          return {
            availablePacks: [packI, packJ, packK],
            wishes: [
              {
                id: wishA,
                createdBy: { id: userA, currentScore: 1, nickname: 'User A' },
                packChoices: [packK],
                createdAt,
              },
              {
                id: wishB,
                createdBy: { id: userB, currentScore: 2, nickname: 'User B' },
                packChoices: [packI, packJ, packK],
                createdAt,
              },
              {
                id: wishC,
                createdBy: { id: userC, currentScore: 3, nickname: 'User C' },
                packChoices: [packK],
                createdAt,
              },
              {
                id: wishD,
                createdBy: { id: userD, currentScore: 4, nickname: 'User D' },
                packChoices: [packI],
                createdAt,
              },
            ],
            expectedAttributions: [
              { wishId: wishA, pack: packK },
              { wishId: wishB, pack: packJ },
              { wishId: wishD, pack: packI },
            ],
            expectedUnassigned: [wishC],
          };
        },
      },
      {
        name: 'should not attribute an unwanted pack',
        setup: () => {
          const mainWish = createUUID();

          return {
            availablePacks: [packJ],
            wishes: [
              {
                id: mainWish,
                packChoices: [packI],
                createdBy: { id: userA, currentScore: 100, nickname: 'User A' },
                createdAt: DateValueObject.fromDate(new Date('2025-11-20T08:00:00Z')),
              },
            ],
            expectedAttributions: [],
            expectedUnassigned: [mainWish],
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

        const result = await service.getAttributions(props);

        try {
          expect(result).toHaveLength(expectedAttributions.length);

          expectedAttributions.forEach(({ wishId, pack }) => {
            expect(result).toContainEqual({
              reservationWishId: wishId,
              assignedPackId: pack.id,
            });
          });

          expectedUnassigned.forEach((wishId) => {
            expect(
              result.find(({ reservationWishId }) => reservationWishId === wishId),
            ).toBeUndefined();
          });
        } catch (error) {
          console.log(
            printDebugInfo(
              name,
              wishes,
              availablePacks,
              result,
              expectedAttributions,
              expectedUnassigned,
            ),
          );
          throw error;
        }
      });
    });
  });
});
