import * as testCases from '@libs/tests/attribution-domain-service';

import { AttributionDomainService } from './attribution.domain-service';
import { BaseValidationEngineProps } from './validation-engine.types';

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
