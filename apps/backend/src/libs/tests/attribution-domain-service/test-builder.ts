import assert from 'assert';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';
import { PackSummary } from '@libs/types/accross-modules';

class Wish {
  pilotName: string;
  packNames: string[] = [];
  score: number;
  date: DateValueObject | undefined;
  expected: string;
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
    date: DateValueObject | undefined,
    packs: string[],
    expected: string | undefined,
  ) {
    assert(expected === undefined || packs.includes(expected));

    let pilot = new Wish();
    pilot.pilotName = pilotName;
    pilot.score = score;
    pilot.packNames = packs;
    pilot.date = date;
    pilot.expected = expected;

    this.wishes.push(pilot);
  }

  addPack(packName: string) {
    if (!this.packs.has(packName)) this.packs.set(packName, { id: UUID.random(), label: packName });
  }

  buildTest() {
    let expectedAttributions: { wishId: UUID; pack: PackSummary }[] = [];
    let expectedUnassigned: UUID[] = [];
    let wishes_: ReservationWishForAttribution[] = [];

    // Pour chaque souhait
    this.wishes.forEach((wish) => {
      const wishId = UUID.random();

      let packChoices_: PackSummary[] = [];

      // Pour chaque pack demandé
      wish.packNames.forEach((pack) => {
        // Crée le pack s'il n'existe pas.
        this.addPack(pack);
        // Ajoute le pack à la liste
        packChoices_.push(this.packs.get(pack));
      });

      // Affecte le résultat au bon tableau
      if (wish.expected === undefined) expectedUnassigned.push(wishId);
      else expectedAttributions.push({ wishId: wishId, pack: this.packs.get(wish.expected) });

      // Ajoute le souhait au tableau de souhaits.
      wishes_.push({
        id: wishId,
        user: { id: UUID.random(), currentScore: wish.score, nickname: wish.pilotName },
        packChoices: packChoices_,
        createdAt: wish.date,
      });
    });

    // Crée la liste des packs
    const availablePacks = [];
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
