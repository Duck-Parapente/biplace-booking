import assert from 'assert';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';
import { PackSummary } from '@libs/types/accross-modules';

class Wish {
  pilotName: string = '';
  packNames: string[] = [];
  score: number = 0;
  date: DateValueObject = DateValueObject.now();
  expected: string | undefined;
}

export class TestBuilder {
  private wishes: Wish[] = [];
  private title: string;
  private packs = new Map<string, PackSummary>();

  constructor(title: string) {
    this.title = title;
  }

  addWish(
    pilotName: string,
    score: number,
    date: DateValueObject,
    packs: string[],
    expected: string | undefined,
  ): void {
    assert(expected === undefined || packs.includes(expected));

    const pilot = new Wish();
    pilot.pilotName = pilotName;
    pilot.score = score;
    pilot.packNames = packs;
    pilot.date = date;
    pilot.expected = expected;

    this.wishes.push(pilot);
  }

  addPack(packName: string): void {
    if (!this.packs.has(packName)) {
      this.packs.set(packName, { id: UUID.random(), label: packName });
    }
  }

  buildTest() {
    const expectedAttributions: { wishId: UUID; pack: PackSummary }[] = [];
    const expectedUnassigned: UUID[] = [];
    const wishes_: ReservationWishForAttribution[] = [];

    // Pour chaque souhait
    this.wishes.forEach((wish) => {
      const wishId = UUID.random();

      const packChoices_: PackSummary[] = [];

      // Pour chaque pack demandé
      wish.packNames.forEach((packName) => {
        // Crée le pack s'il n'existe pas.
        this.addPack(packName);
        // Ajoute le pack à la liste
        const pack = this.packs.get(packName);
        if (pack) {
          packChoices_.push(pack);
        }
      });

      // Affecte le résultat au bon tableau
      if (!wish.expected) {
        expectedUnassigned.push(wishId);
      } else {
        const expectedPack = this.packs.get(wish.expected);
        if (expectedPack) {
          expectedAttributions.push({ wishId: wishId, pack: expectedPack });
        }
      }

      // Ajoute le souhait au tableau de souhaits.
      wishes_.push({
        id: wishId,
        user: { id: UUID.random(), currentScore: wish.score, nickname: wish.pilotName },
        packChoices: packChoices_,
        createdAt: wish.date,
      });
    });

    // Crée la liste des packs
    const availablePacks: PackSummary[] = [];
    this.packs.forEach((pack) => {
      availablePacks.push(pack);
    });

    return {
      name: this.title,
      availablePacks: availablePacks,
      wishes: wishes_,
      expectedAttributions: expectedAttributions,
      expectedUnassigned: expectedUnassigned,
    };
  }
}
