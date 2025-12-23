import { Injectable } from '@nestjs/common';
import munkres from 'munkres';

import { Attribution, BaseValidationEngineProps } from './validation-engine.types';

type ReservationWish = BaseValidationEngineProps['reservationWishes'][number];
type Pack = BaseValidationEngineProps['availablePacks'][number];

interface AssignmentData {
  packIds: (string | undefined)[];
  wishes: ReservationWish[];
  costMatrix: bigint[][];
  incompatibleWeight: bigint;
}

@Injectable()
export class AttributionDomainService {
  // Maximum safe BigInt value to prevent overflow
  // BigInt can handle arbitrarily large integers, but we set a practical limit
  // to catch truly excessive cases while allowing normal operation
  // Using 2^120 to handle edge cases with many wishes and pack choices
  private readonly MAX_SAFE_BIGINT = BigInt(2) ** BigInt(120);

  getAttributions(props: BaseValidationEngineProps): Attribution[] {
    const { reservationWishes, availablePacks } = props;

    if (reservationWishes.length === 0) {
      return [];
    }

    // Build the assignment data and cost matrix
    const assignmentData = this.buildAssignmentData(reservationWishes, availablePacks);

    // Run Munkres algorithm to find optimal assignment
    const resultMatrix = munkres(assignmentData.costMatrix);

    // Build final attributions from the result
    const attributions = this.buildAttributions(resultMatrix, assignmentData);

    return attributions;
  }

  private buildAssignmentData(
    reservationWishes: ReservationWish[],
    availablePacks: Pack[],
  ): AssignmentData {
    const sortedWishes = this.sortWishesByPriority(reservationWishes);
    const increments = this.computeWeightIncrements(sortedWishes, availablePacks);
    const allPacks = new Map<string, number>();

    const { costMatrix, sum } = this.buildCostMatrix(
      sortedWishes,
      availablePacks,
      increments,
      allPacks,
    );

    const incompatibleWeight = sum + BigInt(1);
    const squaredCostMatrix = this.squareCostMatrix(
      costMatrix,
      allPacks.size,
      sortedWishes.length,
      incompatibleWeight,
    );
    const packIds = this.convertPackMapToArray(allPacks);

    return {
      packIds,
      wishes: sortedWishes,
      costMatrix: squaredCostMatrix,
      incompatibleWeight,
    };
  }

  private computeWeightIncrements(
    sortedWishes: ReservationWish[],
    availablePacks: Pack[],
  ): bigint[] {
    return sortedWishes
      .slice()
      .reverse()
      .reduce<{ increments: bigint[]; weightIncrement: bigint }>(
        (acc, wish) => {
          const availableChoices = this.getAvailablePackChoices(wish, availablePacks);
          const choicesCount = BigInt(availableChoices.length);

          const nextWeightIncrement =
            (acc.weightIncrement * choicesCount * (choicesCount + BigInt(1))) / BigInt(2) +
            BigInt(1);

          // Check for potential overflow
          if (nextWeightIncrement > this.MAX_SAFE_BIGINT) {
            throw new Error(
              `Weight increment overflow detected: value ${nextWeightIncrement} exceeds safe BigInt limit. ` +
              `This can happen with too many reservation wishes or pack choices. ` +
              `Consider reducing the number of wishes or available packs.`,
            );
          }

          return {
            increments: [acc.weightIncrement, ...acc.increments],
            weightIncrement: nextWeightIncrement,
          };
        },
        { increments: [], weightIncrement: BigInt(1) },
      ).increments;
  }

  private buildCostMatrix(
    sortedWishes: ReservationWish[],
    availablePacks: Pack[],
    increments: bigint[],
    allPacks: Map<string, number>,
  ): { costMatrix: bigint[][]; sum: bigint } {
    return sortedWishes.reduce<{
      costMatrix: bigint[][];
      sum: bigint;
      previousAccumulatedLine: bigint;
      weight: bigint;
      wishIndex: number;
    }>(
      (acc, wish) => {
        const availableChoices = this.getAvailablePackChoices(wish, availablePacks);

        const { costs, newSum, newWeight } = this.buildCostsForWish(
          availableChoices,
          allPacks,
          acc.weight,
          acc.previousAccumulatedLine,
          acc.sum,
          increments[acc.wishIndex],
        );

        const nextPreviousAccumulatedLine = acc.previousAccumulatedLine + newWeight;

        return {
          costMatrix: [...acc.costMatrix, costs],
          sum: newSum,
          previousAccumulatedLine: nextPreviousAccumulatedLine,
          weight: newWeight + BigInt(1),
          wishIndex: acc.wishIndex + 1,
        };
      },
      {
        costMatrix: [],
        sum: BigInt(0),
        previousAccumulatedLine: BigInt(0),
        weight: BigInt(0),
        wishIndex: 0,
      },
    );
  }

  private buildCostsForWish(
    availableChoices: Pack[],
    allPacks: Map<string, number>,
    initialWeight: bigint,
    previousAccumulatedLine: bigint,
    initialSum: bigint,
    increment: bigint,
  ): { costs: bigint[]; newSum: bigint; newWeight: bigint } {
    return availableChoices.reduce<{
      costs: bigint[];
      newSum: bigint;
      newWeight: bigint;
    }>(
      (packAcc, pack) => {
        let packIndex = allPacks.get(pack.id.uuid);
        if (packIndex === undefined) {
          packIndex = allPacks.size;
          allPacks.set(pack.id.uuid, packIndex);
        }

        const cost = packAcc.newWeight + previousAccumulatedLine;
        packAcc.costs[packIndex] = cost;

        return {
          costs: packAcc.costs,
          newSum: packAcc.newSum + cost,
          newWeight: packAcc.newWeight + increment,
        };
      },
      { costs: [], newSum: initialSum, newWeight: initialWeight },
    );
  }

  private squareCostMatrix(
    costMatrix: bigint[][],
    packsCount: number,
    wishesCount: number,
    incompatibleWeight: bigint,
  ): bigint[][] {
    const maxDim = Math.max(packsCount, wishesCount);
    return costMatrix.map((row) =>
      Array.from({ length: maxDim }, (_, j) => row[j] ?? incompatibleWeight),
    );
  }

  private convertPackMapToArray(allPacks: Map<string, number>): (string | undefined)[] {
    const packIds = Array.from({ length: allPacks.size }, () => undefined as string | undefined);
    allPacks.forEach((index, packUuid) => {
      packIds[index] = packUuid;
    });
    return packIds;
  }

  private buildAttributions(
    resultMatrix: number[][],
    assignmentData: AssignmentData,
  ): Attribution[] {
    return resultMatrix
      .map(([wishIndex, packIndex]) => {
        const wish = assignmentData.wishes[wishIndex];
        const packUuid = assignmentData.packIds[packIndex];

        // Only create attribution if the pack is in the wish's choices
        if (!packUuid || !this.isPackInWishChoices(wish, packUuid)) {
          return null;
        }

        const pack = wish.packChoices.find((p) => p.id.uuid === packUuid);

        return pack
          ? {
            reservationWishId: wish.id,
            assignedPackId: pack.id,
          }
          : null;
      })
      .filter((attribution): attribution is Attribution => attribution !== null);
  }

  private sortWishesByPriority(reservationWishes: ReservationWish[]): ReservationWish[] {
    return [...reservationWishes].sort((a, b) => {
      // Compare by score (lower score = higher priority)
      if (a.user.currentScore !== b.user.currentScore) {
        return a.user.currentScore - b.user.currentScore;
      }
      // If equal, compare by creation date (older = higher priority)
      return a.createdAt.value.getTime() - b.createdAt.value.getTime();
    });
  }

  private getAvailablePackChoices(wish: ReservationWish, availablePacks: Pack[]): Pack[] {
    return wish.packChoices.filter((pack) => availablePacks.some(({ id }) => id.equals(pack.id)));
  }

  private isPackInWishChoices(wish: ReservationWish, packUuid: string): boolean {
    return wish.packChoices.some((choice) => choice.id.uuid === packUuid);
  }
}
