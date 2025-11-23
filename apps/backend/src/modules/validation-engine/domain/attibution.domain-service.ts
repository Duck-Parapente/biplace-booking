import { UUID } from '@libs/ddd/uuid.value-object';
import { Injectable } from '@nestjs/common';

import { Attribution, BaseValidationEngineProps } from './validation-engine.types';

@Injectable()
export class AttributionDomainService {
  async getAttributions(props: BaseValidationEngineProps): Promise<Attribution[]> {
    const { reservationWishes } = props;
    const attributions: Attribution[] = [];
    const assignedPacks = new Set<string>();

    // Étape 1 : Trier par ordre de priorité (userScore décroissant), puis par date de demande (croissant)
    const sortedWishes = [...reservationWishes].sort((a, b) => {
      // Comparer d'abord par score (du plus haut au plus bas)
      if (b.userScore !== a.userScore) {
        return b.userScore - a.userScore;
      }
      // En cas d'égalité, comparer par date de création (du plus ancien au plus récent)
      return a.createdAt.value.getTime() - b.createdAt.value.getTime();
    });

    // Étape 2 : Boucler sur les souhaits (du plus prioritaire au moins prioritaire)
    for (const wish of sortedWishes) {
      // Étape 2.1 : Filtrer les souhaits en enlevant les packs déjà attribués
      const availablePackChoices = wish.packChoices.filter(
        (packId) => !assignedPacks.has(packId.uuid),
      );

      // Étape 2.5 : Si plus de pack disponible, on passe au suivant
      if (availablePackChoices.length === 0) {
        continue;
      }

      // Étape 2.2 : Pour chaque pack voulu, calculer le niveau de conflits
      const packConflicts = new Map<string, number>();

      for (const packId of availablePackChoices) {
        // Compter le nombre de demandes concurrentes pour ce pack
        const conflictCount = sortedWishes.filter((otherWish) =>
          otherWish.packChoices.some((choice) => choice.uuid === packId.uuid),
        ).length;

        packConflicts.set(packId.uuid, conflictCount);
      }

      // Étape 2.3 : Attribuer le pack avec le moins de demandes concurrentes
      // Si plusieurs packs à égalité, on attribue le "plus voulu" (premier dans la liste des choix)
      let selectedPack: UUID | null = null;
      let minConflicts = Infinity;

      for (const packId of availablePackChoices) {
        const conflicts = packConflicts.get(packId.uuid) || 0;

        if (conflicts < minConflicts) {
          minConflicts = conflicts;
          selectedPack = packId;
        }
        // Si égalité de conflits, on garde le premier rencontré (qui est le plus voulu)
      }

      // Étape 2.4 : Enregistrer l'attribution
      if (selectedPack) {
        attributions.push({
          reservationWishId: wish.id,
          assignedPackId: selectedPack,
        });
        assignedPacks.add(selectedPack.uuid);
      }
    }

    return attributions;
  }
}
