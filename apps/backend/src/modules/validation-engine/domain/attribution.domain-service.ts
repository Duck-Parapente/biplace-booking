import { Injectable } from '@nestjs/common';

import { Attribution, BaseValidationEngineProps } from './validation-engine.types';

type ReservationWish = BaseValidationEngineProps['reservationWishes'][number];
type Pack = BaseValidationEngineProps['availablePacks'][number];
type PackId = Pack['id'];

@Injectable()
export class AttributionDomainService {
  getAttributions(props: BaseValidationEngineProps): Attribution[] {
    const { reservationWishes } = props;
    const attributions: Attribution[] = [];
    const assignedPacks = new Set<string>();

    const sortedWishes = this.sortWishesByPriority(reservationWishes);

    for (let i = 0; i < sortedWishes.length; i++) {
      const wish = sortedWishes[i];
      const availablePackChoices = this.filterAvailablePackChoices(
        wish,
        assignedPacks,
        props.availablePacks,
      );

      if (availablePackChoices.length === 0) {
        continue;
      }

      const remainingWishes = sortedWishes.slice(i + 1);
      const packScores = this.calculatePackImpactScores(
        availablePackChoices,
        remainingWishes,
        assignedPacks,
        props.availablePacks,
      );

      const selectedPackId = this.selectOptimalPack(availablePackChoices, packScores);

      attributions.push({
        reservationWishId: wish.id,
        assignedPackId: selectedPackId,
      });
      assignedPacks.add(selectedPackId.uuid);
    }

    return attributions;
  }

  private sortWishesByPriority(reservationWishes: ReservationWish[]): ReservationWish[] {
    return [...reservationWishes].sort((a, b) => {
      // Comparer d'abord par score (du plus bas au plus haut = plus prioritaire d'abord)
      if (a.user.currentScore !== b.user.currentScore) {
        return a.user.currentScore - b.user.currentScore;
      }
      // En cas d'égalité, comparer par date de création (du plus ancien au plus récent)
      return a.createdAt.value.getTime() - b.createdAt.value.getTime();
    });
  }

  private filterAvailablePackChoices(
    wish: ReservationWish,
    assignedPacks: Set<string>,
    availablePacks: Pack[],
  ): Pack[] {
    return wish.packChoices.filter(
      (pack) =>
        !assignedPacks.has(pack.id.uuid) && availablePacks.some(({ id }) => id.equals(pack.id)),
    );
  }

  private calculatePackImpactScores(
    availablePackChoices: Pack[],
    remainingWishes: ReservationWish[],
    assignedPacks: Set<string>,
    availablePacks: Pack[],
  ): Map<string, number> {
    const packScores = new Map<string, number>();

    for (const pack of availablePackChoices) {
      const score = this.calculateSelfishnessScore(
        pack,
        remainingWishes,
        assignedPacks,
        availablePacks,
      );
      packScores.set(pack.id.uuid, score);
    }

    return packScores;
  }

  private calculateSelfishnessScore(
    pack: Pack,
    remainingWishes: ReservationWish[],
    assignedPacks: Set<string>,
    availablePacks: Pack[],
  ): number {
    let score = 0;

    for (const otherWish of remainingWishes) {
      if (!this.wishIncludesPack(otherWish, pack.id)) {
        continue;
      }

      const remainingOptionsCount = this.countRemainingOptions(
        otherWish,
        pack.id,
        assignedPacks,
        availablePacks,
      );

      score += this.getPenaltyForRemainingOptions(remainingOptionsCount);
    }

    return score;
  }

  private wishIncludesPack(wish: ReservationWish, packId: PackId): boolean {
    return wish.packChoices.some((choice) => choice.id.equals(packId));
  }

  private countRemainingOptions(
    wish: ReservationWish,
    excludedPackId: PackId,
    assignedPacks: Set<string>,
    availablePacks: Pack[],
  ): number {
    return wish.packChoices.filter(
      (p) =>
        !p.id.equals(excludedPackId) &&
        !assignedPacks.has(p.id.uuid) &&
        availablePacks.some(({ id }) => id.equals(p.id)),
    ).length;
  }

  private getPenaltyForRemainingOptions(remainingOptionsCount: number): number {
    if (remainingOptionsCount === 0) {
      return 1000; // Les laisserait sans option : pénalité maximale
    } else if (remainingOptionsCount === 1) {
      return 100; // Ne leur laisserait qu'une seule option : pénalité forte
    } else if (remainingOptionsCount === 2) {
      return 10; // Ne leur laisserait que 2 options : pénalité modérée
    } else {
      return 1; // Ont encore beaucoup d'options : pénalité faible
    }
  }

  private selectOptimalPack(availablePackChoices: Pack[], packScores: Map<string, number>): PackId {
    const firstChoiceScore = packScores.get(availablePackChoices[0].id.uuid) || 0;

    if (firstChoiceScore < 200) {
      // Le premier choix n'a pas d'impact significatif sur les autres
      return availablePackChoices[0].id;
    }

    // Le premier choix limiterait trop les autres, trouver une alternative
    return this.findPackWithLowestScore(availablePackChoices, packScores);
  }

  private findPackWithLowestScore(
    availablePackChoices: Pack[],
    packScores: Map<string, number>,
  ): PackId {
    const minScore = Math.min(...Array.from(packScores.values()));

    for (const pack of availablePackChoices) {
      if ((packScores.get(pack.id.uuid) || 0) === minScore) {
        return pack.id;
      }
    }

    // Fallback (should never happen)
    return availablePackChoices[0].id;
  }
}
