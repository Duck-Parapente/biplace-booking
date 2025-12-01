import { UUID } from '@libs/ddd/uuid.value-object';
import * as testCases from '@libs/tests/attribution-domain-service';
import { ReservationWishForAttribution, PackSummary } from '@libs/types/accross-modules';

import { AttributionDomainService } from './attribution.domain-service';
import { BaseValidationEngineProps, Attribution } from './validation-engine.types';

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
    wishes: ReservationWishForAttribution[],
    availablePacks: PackSummary[],
    result: Attribution[],
    expectedAttributions: { wishId: UUID; pack: PackSummary }[],
    expectedUnassigned: UUID[],
  ): string => {
    const lines: string[] = [];

    lines.push(`\n=== Debug for failing test: ${testName} ===`);
    lines.push('Wishes submitted (ordered by score desc):');
    wishes
      .sort(
        (a: ReservationWishForAttribution, b: ReservationWishForAttribution) =>
          b.user.currentScore - a.user.currentScore,
      )
      .forEach((wish: ReservationWishForAttribution) => {
        lines.push(
          `  - ${wish.user.nickname} (score: ${wish.user.currentScore}): ${wish.packChoices.map((p: PackSummary) => p.label).join(', ')}`,
        );
      });

    lines.push('\nActual attributions:');
    result.forEach((attr: Attribution) => {
      const wish = wishes.find(
        (w: ReservationWishForAttribution) => w.id === attr.reservationWishId,
      );
      const pack = availablePacks.find((p: PackSummary) => p.id === attr.assignedPackId);
      if (wish && pack) {
        lines.push(`  - ${wish.user.nickname} → ${pack.label}`);
      }
    });

    lines.push('\nExpected attributions:');
    expectedAttributions.forEach(({ wishId, pack }: { wishId: UUID; pack: PackSummary }) => {
      const wish = wishes.find((w: ReservationWishForAttribution) => w.id === wishId);
      if (wish) {
        lines.push(`  - ${wish.user.nickname} → ${pack.label}`);
      }
    });

    lines.push('\nUnassigned wishes:');
    const assignedWishIds = new Set(result.map((r: Attribution) => r.reservationWishId));
    wishes.forEach((wish: ReservationWishForAttribution) => {
      if (!assignedWishIds.has(wish.id)) {
        lines.push(
          `  - ${wish.user.nickname} (expected: ${expectedUnassigned.includes(wish.id) ? 'YES' : 'NO'})`,
        );
      }
    });
    lines.push('===========================\n');

    return lines.join('\n');
  };

  describe('attributePacks', () => {
    const testFunctions = Object.values(testCases);

    testFunctions.forEach((setup) => {
      const { name } = setup();
      it(name, async () => {
        const { availablePacks, wishes, expectedAttributions, expectedUnassigned } = setup();

        const props: BaseValidationEngineProps = {
          availablePacks,
          reservationWishes: wishes,
        };

        const result = service.getAttributions(props);

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
