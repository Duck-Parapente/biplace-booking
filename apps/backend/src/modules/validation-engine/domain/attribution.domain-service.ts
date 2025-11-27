import { Injectable } from '@nestjs/common';

import { Attribution, BaseValidationEngineProps } from './validation-engine.types';

@Injectable()
export class AttributionDomainService {
  async getAttributions(props: BaseValidationEngineProps): Promise<Attribution[]> {
    const { reservationWishes } = props;
    const attributions: Attribution[] = [];
    const assignedPacks = new Set<string>();

    // Étape 1 : Trier par ordre de priorité (userScore croissant = plus prioritaire), puis par date de demande (croissant)
    const sortedWishes = [...reservationWishes].sort((a, b) => {
      // Comparer d'abord par score (du plus bas au plus haut = plus prioritaire d'abord)
      if (a.createdBy.currentScore !== b.createdBy.currentScore) {
        return a.createdBy.currentScore - b.createdBy.currentScore;
      }
      // En cas d'égalité, comparer par date de création (du plus ancien au plus récent)
      return a.createdAt.value.getTime() - b.createdAt.value.getTime();
    });

    // Étape 2 : Boucler sur les souhaits (du plus prioritaire au moins prioritaire)
    for (let i = 0; i < sortedWishes.length; i++) {
      const wish = sortedWishes[i];
      // Étape 2.1 : Filtrer les souhaits en enlevant les packs déjà attribués et ceux qui ne sont pas disponibles
      const availablePackChoices = wish.packChoices.filter(
        (pack) =>
          !assignedPacks.has(pack.id.uuid) &&
          props.availablePacks.some(({ id }) => id.equals(pack.id)),
      );

      // Étape 2.5 : Si plus de pack disponible, on passe au suivant
      if (availablePackChoices.length === 0) {
        continue;
      }

      // Étape 2.2 : Pour chaque pack voulu, calculer le niveau de conflits avec les souhaits restants
      const packConflicts = new Map<string, number>();
      const remainingWishes = sortedWishes.slice(i + 1);

      for (const packId of availablePackChoices) {
        const conflictCount = remainingWishes.filter((otherWish) =>
          otherWish.packChoices.some((choice) => choice.id.equals(packId.id)),
        ).length;
        packConflicts.set(packId.id.uuid, conflictCount);
      }

      // Étape 2.3 : Attribuer le pack en priorisant la préférence utilisateur tout en tenant compte des conflits
      // Stratégie :
      // - Si un pack a 0 conflits et que le premier choix n'est pas à 0, prendre celui à 0
      // - Sinon, si le premier choix a un niveau de conflits proche du minimum (≤ min + 1), le prendre
      // - Sinon, prendre le pack avec le minimum de conflits
      const minConflicts = Math.min(...Array.from(packConflicts.values()));
      const firstChoiceConflicts = packConflicts.get(availablePackChoices[0].id.uuid) || 0;

      let selectedPackId;
      if (minConflicts === 0 && firstChoiceConflicts > 0) {
        // Il existe un pack sans conflits et le premier choix en a : prendre celui sans conflits
        for (const packId of availablePackChoices) {
          const conflicts = packConflicts.get(packId.id.uuid) || 0;
          if (conflicts === 0) {
            selectedPackId = packId.id;
            break;
          }
        }
      } else if (firstChoiceConflicts <= minConflicts + 1) {
        // Le choix préféré a un niveau de conflits acceptable : le prendre
        selectedPackId = availablePackChoices[0].id;
      } else {
        // Le choix préféré a trop de conflits : prendre celui qui a le minimum
        for (const packId of availablePackChoices) {
          const conflicts = packConflicts.get(packId.id.uuid) || 0;
          if (conflicts === minConflicts) {
            selectedPackId = packId.id;
            break;
          }
        }
      }

      // Étape 2.3 : Enregistrer l'attribution
      attributions.push({
        reservationWishId: wish.id,
        assignedPackId: selectedPackId,
      });
      assignedPacks.add(selectedPackId.uuid);
    }

    return attributions;
  }
}
