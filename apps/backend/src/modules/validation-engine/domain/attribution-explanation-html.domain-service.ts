import { Injectable } from '@nestjs/common';

import { Attribution, BaseValidationEngineProps, EnginePack } from './validation-engine.types';

const getNumberDisplay = (index: number): string => {
  const emojiNumbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  if (index < emojiNumbers.length) {
    return emojiNumbers[index];
  }
  return String(index + 1);
};

@Injectable()
export class AttributionExplanationHtmlDomainService {
  generateHtmlTable(
    allPacks: EnginePack[],
    { availablePacks, reservationWishes }: BaseValidationEngineProps,
    attributions: Attribution[],
  ): string {
    const allPackLabels = allPacks.map((p) => p.label);

    const pilots = reservationWishes.map((wish) => {
      const attribution = attributions.find((a) => a.reservationWishId.equals(wish.id));
      const attributedPack = attribution
        ? allPacks.find((p) => p.id.equals(attribution.assignedPackId))
        : null;

      return {
        userNickname: wish.user.nickname,
        score: wish.user.currentScore,
        attributedPackLabel: attributedPack?.label || null,
        packChoices: wish.packChoices.map((p) => p.label),
      };
    });

    const tableRows = pilots
      .map((pilot) => {
        const packCells = allPacks
          .map(({ id: packId, label: packLabel }) => {
            const isAvailable = availablePacks.some((p) => p.id.uuid === packId.uuid);
            const choiceIndex = pilot.packChoices.indexOf(packLabel);
            const isChoice = choiceIndex !== -1;
            const isAttributed = pilot.attributedPackLabel === packLabel;

            let backgroundColor = '#ffffff';
            let content = '';

            if (!isAvailable) {
              backgroundColor = '#ffe6e6';
            } else if (isAttributed) {
              backgroundColor = '#c8f7c8';
            }

            if (isChoice) {
              content = getNumberDisplay(choiceIndex);
            }

            return `<td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 16px; background-color: ${backgroundColor};">${content}</td>`;
          })
          .join('');

        return `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${pilot.userNickname}</td>
            ${packCells}
          </tr>
        `;
      })
      .join('');

    return `
      <div style="margin: 20px 0; font-family: Arial, sans-serif;">
        <h3>Détail des attributions</h3>
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Pilote</th>
              ${allPackLabels.map((label) => `<th style="padding: 8px; border: 1px solid #ddd; text-align: center;">${label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <p style="margin-top: 15px; font-size: 12px; color: #6c757d;">
          <span style="display: inline-block; width: 20px; height: 20px; background-color: #c8f7c8; border: 1px solid #ddd; vertical-align: middle;"></span> = Pack attribué &nbsp;&nbsp;
          <span style="display: inline-block; width: 20px; height: 20px; background-color: #ffe6e6; border: 1px solid #ddd; vertical-align: middle;"></span> = Pack indisponible avant l'attribution automatique
        </p>
        <p style="margin-top: 5px; font-size: 12px; color: #6c757d;">
          Numéro = ordre de préférence du choix &nbsp;&nbsp;
        </p>
      </div>
    `;
  }
}
