import { Injectable } from '@nestjs/common';

import { Attribution, BaseValidationEngineProps } from './validation-engine.types';

@Injectable()
export class AttributionExplanationHtmlDomainService {
  generateHtmlTable(
    { availablePacks, reservationWishes }: BaseValidationEngineProps,
    attributions: Attribution[],
  ): string {
    const allPackLabels = availablePacks.map((p) => p.label);

    const pilots = reservationWishes.map((wish) => {
      const attribution = attributions.find((a) => a.reservationWishId.equals(wish.id));
      const attributedPack = attribution
        ? availablePacks.find((p) => p.id.equals(attribution.assignedPackId))
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
        const packCells = allPackLabels
          .map((packLabel) => {
            const isChoice = pilot.packChoices.includes(packLabel);
            const isAttributed = pilot.attributedPackLabel === packLabel;

            let icon = '';
            if (isAttributed) {
              icon = '🟢'; // Green circle for attributed
            } else if (isChoice) {
              icon = '⚪'; // White circle for choice
            }

            return `<td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 16px;">${icon}</td>`;
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
        <h3>Attributions sur les packs disponibles</h3>
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
          <span style="font-size: 16px;">⚪</span> = Choix demandé &nbsp;&nbsp;
          <span style="font-size: 16px;">🟢</span> = Pack attribué
        </p>
      </div>
    `;
  }
}
