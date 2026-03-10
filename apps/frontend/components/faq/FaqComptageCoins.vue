<template>
  <div>
    <p class="mb-4">
      Un certain nombre de Coins est attribué à toute demande de réservation validée. Lors du
      process d'attribution, l'application utilise la somme des Coins de toutes les réservations
      effectuées dans les <strong>365 jours qui précèdent</strong> la date d'attribution (une année
      glissante).
    </p>
    <p class="mb-4">
      Les Coins d'une réservation sont calculés lorsque celle-ci est clôturée ou annulée.
    </p>
    <p class="mb-4">
      <strong>Pour une réservation avec vol</strong>, le nombre de Coins correspond au nombre
      d'heures écoulées entre l'attribution du matériel et 23:59 de la date du vol.<br />
      <strong>Pour une réservation annulée</strong>, le nombre de Coins correspond au nombre
      d'heures écoulées entre l'attribution du matériel et l'heure d'annulation.
    </p>
    <p class="mb-4">Voici quelques exemples pour illustrer cela :</p>
    <div class="space-y-6">
      <div>
        <h5 class="font-semibold text-gray-900 mb-3">
          ✅ Cas 1 : Tu réserves tôt et clôtures ta réservation après le vol
        </h5>
        <div>
          <table class="w-full text-xs text-gray-600 table-fixed">
            <tbody>
              <tr class="h-5">
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-blue-600 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>

                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>

                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-blue-600 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>

                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>

                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-green-600 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-green-700 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-center">10/01<br />Demande</td>
                <td class="text-center"></td>
                <td class="text-center">12/01<br />20:00<br />Attibution</td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center">18/01<br />Vol</td>
                <td class="text-center">19/01<br />Clôture</td>
              </tr>
              <tr>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center">4 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
          <p class="text-sm">
            <strong>Calcul :</strong> 4+24+24+24+24+24+24 heures entre attibution et la date du vol
            (23:59)<br /><strong>Coins ajoutés :</strong>
            148 Coins
          </p>
        </div>
      </div>

      <div>
        <h5 class="font-semibold text-gray-900 mb-3">
          ✅ Cas 2 : Tu réserves tardivement et clôtures ta réservation après le vol
        </h5>
        <p class="mb-4">
          C'est possible si du matériel est encore disponible ou qu'une réservation a été annulée à
          moins de 6 jours du jour J.
        </p>
        <div>
          <table class="w-full text-xs text-gray-600 table-fixed">
            <tbody>
              <tr class="h-5">
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-blue-600 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-green-600 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-green-700 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-center"><br /></td>
                <td class="text-center"><br /></td>
                <td class="text-center"><br /></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center">15/01<br />18:00<br />Demande et attribution</td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center">18/01<br />Vol</td>
                <td class="text-center">19/01<br />Clôture</td>
              </tr>
              <tr>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center">6 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
          <p class="text-sm">
            <strong>Calcul :</strong> 6+24+24+24 heures entre attribution et la date du vol
            (23:59)<br /><strong>Points ajoutés :</strong>
            78 Coins
          </p>
        </div>
      </div>

      <div>
        <h5 class="font-semibold text-gray-900 mb-3">⚠️ Cas 3 : Tu annules</h5>
        <div>
          <table class="w-full text-xs text-gray-600 table-fixed">
            <tbody>
              <tr class="h-5">
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-blue-600 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>

                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-blue-600 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>

                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-red-600 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>

                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
                <td class="relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white relative z-10"
                    ></div>
                  </div>
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full h-0.5 bg-blue-400"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-center">10/01<br />Demande</td>
                <td class="text-center"></td>
                <td class="text-center">12/01<br />20:00<br />Attibution</td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center">16/01<br />07:00<br />Annulation</td>
                <td class="text-center"></td>
                <td class="text-center"></td>
              </tr>
              <tr>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center">4 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">24 Coins</td>
                <td class="text-center">7 Coins</td>
                <td class="text-center"></td>
                <td class="text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3 p-3 bg-orange-50 rounded border border-orange-200">
          <p class="text-sm">
            <strong>Calcul :</strong> 4+24+24+24+7 heures entre attibution et l'annulation.<br /><strong
              >Points ajoutés :</strong
            >
            83 Coins
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
