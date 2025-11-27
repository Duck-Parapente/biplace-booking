import { randomUUID } from 'crypto';

import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationWishForAttribution } from '@libs/types/accross-modules';
import { PackSummary } from '@libs/types/accross-modules';
import { Injectable } from '@nestjs/common';

const createUUID = (): UUID => {
    return new UUID({ uuid: randomUUID() });
};


class Pilot {
    packs: string[] = [];
    name: string;
    score: number;
    date: DateValueObject | undefined;
    expected: string;
}


@Injectable()
export class TestBuilder {
    private pilots: Pilot[] = [];
    private removedPacks: string[] = [];
    private title: string;

    constructor(title: string) {
        this.title = title;
    }

    addWish(pilotName: string, score: number, date: DateValueObject | undefined, packs: string[], expected: string | undefined) {
        let pilot = new Pilot();
        pilot.name = pilotName;
        pilot.score = score;
        pilot.packs = packs;
        pilot.date = date;
        pilot.expected = expected;

        this.pilots.push(pilot);
    }

    removePack(packName: string) {
        this.removedPacks.push(packName);
    }


    buildTest() {
        let expectedAttributions_: { wishId: UUID, pack: PackSummary }[] = [];
        let expectedUnassigned_: UUID[] = [];
        let wishes_: ReservationWishForAttribution[] = [];
        let packs = new Map<string, PackSummary>();

        // Pour chaque pilote
        this.pilots.forEach((pilot) => {
            const wishId = createUUID();

            let packChoices_: PackSummary[] = [];

            // Pour chaque pack demandé
            pilot.packs.forEach((pack) => {
                // Crée le pack s'il n'existe pas.
                if (!packs.has(pack)) {
                    packs.set(pack, { id: createUUID(), label: pack });
                }
                // Ajoute le pack à la liste
                packChoices_.push(packs.get(pack));
            });

            // Affecte le résultat au bon tableau
            if (pilot.expected === undefined)
                expectedUnassigned_.push(wishId);
            else
                expectedAttributions_.push({ wishId: wishId, pack: packs.get(pilot.expected) });

            // Ajoute le souhait au tableau de souhaits.
            wishes_.push({
                id: wishId,
                createdBy: { id: createUUID(), currentScore: pilot.score, nickname: pilot.name },
                packChoices: packChoices_,
                createdAt: pilot.date,
            })
        });

        // Crée la liste des packs 
        //// Supprime les packs supprimés de la map
        this.removedPacks.forEach((pack) => {
            packs.delete(pack);
        });
        //// convertit le reste en tableau
        const availablePacks_ = [];
        packs.forEach((pack) => {
            availablePacks_.push(pack);
        });

        return {
            name: this.title,
            availablePacks: availablePacks_,
            wishes: wishes_,
            expectedAttributions: expectedAttributions_,
            expectedUnassigned: expectedUnassigned_,
        };
    }
}

