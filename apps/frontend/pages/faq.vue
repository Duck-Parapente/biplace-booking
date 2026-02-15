<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-4 m-4">
        <p class="text-gray-600">
          Retrouve ici toutes les réponses aux questions fréquentes sur le système de réservation
          des vols biplaces.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <FaqItem question="1. J'aimais bien la Duck sheet">
          <p class="mb-3">
            Nous aussi mais cette bonne vieille sheet avait un certain nombre de limites que cette
            application vise à combler :
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>Équité des pilotes pour l'utilisation du matériel.</li>
            <li>Ergonomie discutable, surtout sur mobile.</li>
            <li>Carnet de vol parfois non rempli.</li>
          </ul>
        </FaqItem>

        <FaqItem question="2. Qu'est-ce qu'un Coin ?">
          <p>
            C'est le petit nom donné aux points qui sont attribués aux pilotes pour déterminer leur
            priorité. <strong>Plus tu as de Coins, moins tu es prioritaire.</strong> Lis la suite
            pour comprendre comment ils sont calculés.
          </p>
        </FaqItem>

        <FaqItem
          question="3. Quelle est la différence entre une demande de réservation et une réservation ?"
        >
          <p class="mb-3">
            <strong class="text-gray-900">Une demande de réservation</strong> est ton souhait de
            disposer d'un biplace pour une date précise. C'est la première étape du processus. Tu
            exprimes ton intention pour un ou plusieurs packs, mais pour l'instant, aucun ne t'est
            attribué.
          </p>
          <p class="mb-3">
            <strong class="text-gray-900">Une réservation</strong> est une demande validée par le
            système. Tu as alors un créneau garanti pour voler avec un pack attribué.
          </p>
          <p>
            Le passage d'une demande à une réservation confirmée est réalisée par l'application en
            assurant une équité maximale entre les pilotes (voir question "comment fonctionne
            l'algorithme d'attribution des packs ?").
          </p>
        </FaqItem>

        <FaqItem question="4. Comment se déroule le processus de réservation ?">
          <div class="space-y-4">
            <div class="border-l-4 border-blue-500 pl-4 py-2">
              <h4 class="font-semibold text-gray-900 mb-1">📅 Faire tes demandes</h4>
              <p class="mb-3">
                Tu peux faire autant de demandes que tu le souhaites pour n'importe quelle date
                future. Tu postules pour les matériels que tu désires par ordre de priorité. Par
                exemple : "je préfère le takoo, mais si c'est le sora, il fera l'affaire mais je ne
                veux pas du yéti."
              </p>
            </div>

            <div class="border-l-4 border-green-500 pl-4 py-2">
              <h4 class="font-semibold text-gray-900 mb-1">✅ L'attribution du matériel</h4>
              <p class="mb-3">
                L'application attribue le matériel toutes les 30 minutes pour les 5 jours qui
                viennent en commençant à 20h00.
              </p>
              <p class="mb-3">
                En d'autres termes, le dimanche soir à 20h00, l'application prend les demandes de
                réservation pour le samedi suivant et attribue les matériels.
              </p>
              <p class="mb-3">
                Il continuera de tenter d'affecter le matériel encore disponible toutes les 30
                minutes jusqu'au samedi soir. Cela permet de prendre en compte les annulations et
                les nouvelles demandes.
              </p>
              <p class="mb-3">
                Évidemment, ce process fonctionne pour tous les jours : Le lundi pour le dimanche,
                le mardi pour le lundi etc...
              </p>
              <p class="mb-3">En encore d'autres termes :</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Avant J-6, rien n'est attribué.</li>
                <li>À J-6, l'attribution est faite.</li>
                <li>
                  À partir de J-6 20h00, tout événement qui nécessite une ré-attribution est traité
                  dans les 30 minutes.
                </li>
              </ul>
              <p class="mt-3">
                Les pilotes qui ont des demandes actives reçoivent un mail indiquant le résultat de
                l'affectation.
              </p>
            </div>

            <div class="border-l-4 border-orange-500 pl-4 py-2">
              <h4 class="font-semibold text-gray-900 mb-1">🎯 Après la date de la réservation</h4>
              <p class="mb-3">
                Une fois ton vol effectué, tu dois <strong>clôturer ta réservation</strong> en
                renseignant les informations dans ton carnet de vol. Cette clôture permettra de
                mettre à jour tes Coins pour les prochaines réservations.
              </p>
              <p class="mb-3">
                La clôture est <strong>obligatoire</strong> même si tu n'as pas volé. Tu ne pourras
                pas déposer de nouvelle demande tant qu'il te reste des vols non clos.
              </p>
            </div>
          </div>
        </FaqItem>

        <FaqItem question="5. Comment fonctionne l'algorithme d'attribution des packs ?">
          <p class="mb-4">Deux critères sont utilisés :</p>
          <ol class="list-decimal pl-6 mb-4 space-y-3">
            <li>
              <strong>La priorité du pilote</strong> est déterminée par le nombre de Coins (plus il
              est élevé, moins tu es prioritaire). En cas d'égalité, le pilote qui a déposé sa
              demande le premier est prioritaire. Ce critère de priorité du pilote est absolu : s'il
              existe une combinaison pour qu'un pilote de priorité plus élevée qu'un autre ait du
              matériel, alors celle-ci est retenue.
            </li>
            <li>
              <strong>Le critère de priorité dans les souhaits de pack.</strong> Ce critère est
              secondaire : parmi les solutions qui répondent au critère ci-dessus, l'algo choisit
              celle qui satisfait au mieux les pilotes les plus prioritaires.
            </li>
          </ol>

          <div class="bg-gray-50 p-6 rounded-lg mb-4">
            <h4 class="font-semibold text-gray-900 mb-4 text-center">Exemple numéro 1</h4>

            <!-- Demandes initiales -->
            <div class="mb-6">
              <p class="text-sm font-semibold text-gray-700 mb-3">📋 Demandes de réservation :</p>
              <div class="space-y-2">
                <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Pilote 1</span>
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Score: 50 Coins (plus prioritaire)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Demande : Pack A sinon Pack B</div>
                </div>
                <div class="bg-white p-3 rounded border-l-4 border-orange-500">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Pilote 2</span>
                    <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Score: 120 Coins (moins prioritaire)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Demande : Pack A sinon Pack B</div>
                </div>
              </div>
            </div>

            <div class="text-center text-2xl text-gray-400 my-4">↓</div>

            <!-- Résultat -->
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-3">✅ Attribution finale :</p>
              <div class="space-y-2">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p class="text-sm text-gray-700">Le pack A est attribué au pilote 1</p>
                </div>
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p class="text-sm text-gray-700">Le pack B est attribué au pilote 2</p>
                </div>
              </div>
            </div>

            <!-- Explication -->
            <div class="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p class="text-sm text-gray-700">
                <strong>💡 Pourquoi cette attribution ?</strong><br />
                Les deux pilotes demandent les même packs. Pilote 1 est plus prioritaire,
                l'algorithme lui attribue son pack préféré (A) et attribue à Pilote 2 le Pack
                restant (B).<br />
                <strong>Résultat : les deux demandes sont satisfaites.</strong>.
              </p>
            </div>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg mb-4">
            <h4 class="font-semibold text-gray-900 mb-4 text-center">Exemple numéro 2</h4>

            <!-- Demandes initiales -->
            <div class="mb-6">
              <p class="text-sm font-semibold text-gray-700 mb-3">📋 Demandes de réservation :</p>
              <div class="space-y-2">
                <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Pilote 1</span>
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Score: 50 Coins (plus prioritaire)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Demande : Pack A sinon Pack B</div>
                </div>
                <div class="bg-white p-3 rounded border-l-4 border-orange-500">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Pilote 2</span>
                    <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Score: 120 Coins (moins prioritaire)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Demande : Pack A</div>
                </div>
              </div>
            </div>

            <div class="text-center text-2xl text-gray-400 my-4">↓</div>

            <!-- Résultat -->
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-3">✅ Attribution finale :</p>
              <div class="space-y-2">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p class="text-sm text-gray-700">Le pack B est attribué au pilote 1</p>
                </div>
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p class="text-sm text-gray-700">Le pack A est attribué au pilote 2</p>
                </div>
              </div>
            </div>

            <!-- Explication -->
            <div class="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p class="text-sm text-gray-700">
                <strong>💡 Pourquoi cette attribution ?</strong><br />
                Bien que Pilote 1 soit plus prioritaire, l'algorithme lui attribue le Pack B car
                cela permet d'attribuer aussi le Pack A au Pilote 2.
                <strong>Résultat : les deux demandes sont satisfaites.</strong>.
              </p>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg mb-4">
            <h4 class="font-semibold text-gray-900 mb-4 text-center">Exemple numéro 3</h4>

            <!-- Demandes initiales -->
            <div class="mb-6">
              <p class="text-sm font-semibold text-gray-700 mb-3">📋 Demandes de réservation :</p>
              <div class="space-y-2">
                <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Pilote 1</span>
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Score: 50 Coins (plus prioritaire)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Demande : Pack A</div>
                </div>
                <div class="bg-white p-3 rounded border-l-4 border-orange-500">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Pilote 2</span>
                    <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Score: 120 Coins (moins prioritaire)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Demande : Pack A</div>
                </div>
                <div class="bg-white p-3 rounded border-l-4 border-red-500">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Pilote 3</span>
                    <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      Score: 130 Coins (le moins prioritaire)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Demande : Pack A sinon B</div>
                </div>
              </div>
            </div>

            <div class="text-center text-2xl text-gray-400 my-4">↓</div>

            <!-- Résultat -->
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-3">✅ Attribution finale :</p>
              <div class="space-y-2">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p class="text-sm text-gray-700">Le pack A est attribué au pilote 1</p>
                </div>
                <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-500">
                  <p class="text-sm text-gray-700">Aucun pack est attribué au pilote 2</p>
                </div>
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p class="text-sm text-gray-700">Le pack B est attributé au pilote 3</p>
                </div>
              </div>
            </div>

            <!-- Explication -->
            <div class="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p class="text-sm text-gray-700">
                <strong>💡 Pourquoi cette attribution ?</strong><br />
                Bien que le pilote 2 soit plus prioritaire que le pilote 3, l'algorithme ne lui
                attribue aucun pack parce que le seul qu'il désirait (A) est déjà attribué au pilote
                1 plus prioritaire. <br />
                Le pilote 3 reçoit le pack B qu'il avait mis en second choix.<br />
                <strong
                  >Résultat : Une demande plus prioritaire n'est pas satisfaite parce que tous les
                  packs souhaités sont déjà attribués à un (des) pilotes encore plus prioritaires.
                  Le pilote B aurait pu augumenter ses chances en postulant à plus de packs.</strong
                >
              </p>
            </div>
          </div>
        </FaqItem>

        <FaqItem question="6. Comment sont comptés les Coins ?">
          <p class="mb-4">
            Un certain nombre de Coins est attribué à toute demande de réservation validée. Lors du
            process d'attribution, l'application utilise la somme des Coins de toutes les
            réservations effectuées dans les <strong>365 jours qui précèdent</strong> la date
            d'attribution (une année glissante).
          </p>
          <p class="mb-4">
            Les Coins d'une réservation sont calculés lorsque celle-ci est clôturée ou annulée.
          </p>
          <p class="mb-4">
            <strong>Pour une réservation avec vol</strong>, le nombre de Coins correspond au nombre
            d'heures écoulées entre l'attribution du matériel et 23:59 de la date du vol.<br/>
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
                      <td class="text-center">12/01<br />20:00<br />Confirmation</td>
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
                  <strong>Calcul :</strong> 4+24+24+24+24+24+24 heures entre confirmation et la date
                  du vol (23:59)<br /><strong>Coins ajoutés :</strong>
                  148 Coins
                </p>
              </div>
            </div>

            <div>
              <h5 class="font-semibold text-gray-900 mb-3">
                ✅ Cas 2 : Tu réserves tardivement et clôtures ta réservation après le vol
              </h5>
              <p class="mb-4">
                C'est possible si du matériel est encore disponible ou qu'une réservation a été
                annulée à moins de 5 jours du jour J.
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
                      <td class="text-center">15/01<br />18:00<br />Demande et confirmation</td>
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
                  <strong>Calcul :</strong> 6+24+24+24 heures entre confirmation et la date du vol
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
                      <td class="text-center">12/01<br />20:00<br />Confirmation</td>
                      <td class="text-center"></td>
                      <td class="text-center"></td>
                      <td class="text-center"></td>
                      <td class="text-center">16/01<br />07:00<br />Annulation</td>
                      <td class="text-center"></td>
                      <td class="text-center"></td>
                    </tr>
                    <tr>
                      <td class="text-center">10/01<br />Demande</td>
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
                  <strong>Calcul :</strong> 4+24+24+24+7 heures entre confirmation et
                  l'annulation.<br /><strong>Points ajoutés :</strong>
                  83 Coins
                </p>
              </div>
            </div>
          </div>
        </FaqItem>

        <FaqItem question="7. Que se passe-t-il si ma demande n'est pas validée ?">
          <p class="mb-3">
            Si ta demande n'est pas validée à J-6, cela signifie que d'autres pilotes avec un nombre
            de Coins plus faible ont été prioritaires sur les matériels disponibles.
          </p>
          <p class="mb-3"><strong>Tes options :</strong></p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              Conserver ta demande en attente au cas où des biplaces se libèrent (annulation d'une
              autre réservation).
            </li>
            <li>Annuler ta demande.</li>
          </ul>
          <p class="mt-3">En tout état de cause aucun Coin n'est crédité.</p>
        </FaqItem>

        <FaqItem question="8. Puis-je annuler ma réservation après validation ?">
          <p class="mb-3">
            Bien sûr. Note cependant que ton nombre de Coins sera quand même augmenté en fonction du
            temps écoulé entre la validation et l'annulation (Voir paragraphe "Comment sont comptés les Coins ?"). En d'autres termes, plus tu annules
            tôt moins tu seras pénalisé parce que cela laisse plus de temps à un autre pilote pour
            s'organiser.
          </p>
          <p class="mt-3">
            Privilégie les demandes sur des dates où tu es vraiment certain d'être disponible pour
            voler pour éviter ce désagrément.
          </p>
        </FaqItem>

        <FaqItem question="9. Il a plu, je n'ai pas pu voler">
          <p class="mb-3">
            Désolé mais les Coins seront quand même comptés. Outre le fait que personne ne peut
            vérifier tes dires, tu as eu le matériel pour toi alors qu'un autre pilote aurait
            peut-être fait le choix d'un endroit où il n'a pas plu.<br />
          </p>
          <p class="mb-3">
            L'autre raison est pour éviter les réservations posées "au cas où j'aurais le temps" et 
            qui ne sont pas honorées ni annulées. Le principe étant de favoriser l'annulation au
            plus tôt pour permettre à d'autres pilotes de s'organiser.
          </p>
          <p class="mb-3">
            Sur le plan strict de la météo, nous sommes conscients que cela est frustrant mais tout
            le monde est soumis aux aléas météo de la même façon, cela est donc équitable dans la
            durée.
          </p>
        </FaqItem>

        <FaqItem question="10. Comment maximiser mes chances ?">
          <ul class="list-disc pl-6 space-y-3">
            <li>
              <strong>Postule à tous les biplaces qui peuvent te convenir</strong> plutôt qu'à un
              seulement ton préféré.
            </li>
            <li>
              <strong>Postule aux jours avec une faible demande.</strong> <br />De façon
              caricaturale : en semaine et ou en hiver. Tu as compris l'idée.<br />
              Même si tu as beaucoup de Coins, tu peux te placer dans les trous pour voler quand
              même.
            </li>
            <li>
              <strong>Réserver peu</strong> permet d'avoir plus de choix dans la date et d'augmenter
              la probabilité d'avoir du matériel plusieurs jours consécutifs (voir plus bas).
            </li>
            <li>
              <strong>En engrangeant le moins de Coins possibles :</strong>
              <ul class="list-disc pl-6 space-y-3">
                <li>
                  <strong>Gère tes demandes :</strong><br />
                  Nous sommes le 1er jour du mois, tu as demandé un pack pour le 4 mais aucun pack
                  ne t'a été attribué. <br />Tant qu'un biplace t'intéresse, conserve ta demande
                  pour le 4. En effet, si le pilote à qui il est attribué se désiste, il te sera
                  peut-être attribué.<br />
                  Par contre, si le 2, tu décides que comme tu n'as pas de biplace, tu iras grimper
                  avec tes potes, annule ta demande. Dans le cas contraire, si le pilote à qui il
                  est attribué se désiste, il te sera peut-être attribué et tu seras redevable d'au
                  moins un Coin même si tu l'annules rapidement.
                </li>
                <li>
                  <strong>Réserver plus tard que J-6 coûte moins cher mais est plus risqué.</strong
                  ><br />
                  Cela peut être une stratégie plus économique dans les périodes de faible demande :
                  Si tu désires voler en février, la demande est généralement faible. En consultant
                  régulièrement le planning, tu peux attendre le dernier moment pour réserver et
                  ainsi limiter le nombre de Coins.
                </li>
                <li>
                  <strong>Si tu sens que la météo va tourner au vinaigre,</strong> annule ta
                  réservation le plus tôt possible, cela coûte moins de Coins que la veille du vol
                  ou le jour même.
                </li>
              </ul>
            </li>
          </ul>
        </FaqItem>

        <FaqItem
          question="11. J'ai besoin d'un bi pour une formation, un examen ou une journée club"
        >
          <p class="mb-3">
            Ces événements sont prioritaires par rapport au système de Coins. Contacte un
            administrateur pour qu'il valide ta demande de réservation avant J-6. Le plus tôt
            possible est le mieux.
          </p>
          <p>
            Après J-6, il te faudra soit postuler sur un matériel disponible soit négocier avec les
            pilotes plus prioritaires pour en obtenir un.
          </p>
        </FaqItem>

        <FaqItem question="12. Je veux réserver plusieurs jours">
          <p class="mb-3">
            Aujourd'hui, et probablement pour encore quelques temps, la notion de "réserver
            plusieurs jours" n'existe pas. Tu fais autant de demandes que de jours désirés et chaque
            demande est gérée indépendamment des autres.
          </p>
          <p class="mb-3">
            <strong>Exemple :</strong> Tu fais des demandes pour samedi et dimanche, il est
            absolument possible que tu n'aies du matériel que pour samedi, que pour dimanche, pour
            samedi et dimanche mais il est possible que les matériels soient différents.
          </p>
          <p class="mb-3"><strong>Que faire dans ce cas ?</strong></p>
          <p class="mb-3">
            Nous sommes un club. Il est toujours temps de discuter pour tenter de trouver un
            arrangement avec les pilotes plus prioritaires que toi.
          </p>
          <p>
            Par ailleurs, si tu as du matériel affecté pour deux jours mais que ce n'est pas le
            même, contacte un canard qui a un autre matériel pour échanger l'un des deux jours. En
            cas d'accord, contacte un admin pour qu'il intervertisse les réservations (nécessaire
            pour le carnet de vol).
          </p>
        </FaqItem>

        <FaqItem question="13. Comment consulter mon score Coins actuel ?">
          <p>
            Ton score Coins est visible sur ta
            <NuxtLink to="/mon-compte" class="text-blue-600 underline">page de profil</NuxtLink>. Il
            est mis à jour en temps réel.
          </p>
        </FaqItem>

        <FaqItem question="14. Qui puis-je contacter si j'ai d'autres questions ?">
          <p class="mb-3">Pour toute question supplémentaire ou problème technique, tu peux :</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              Consulter la page
              <NuxtLink to="/contacts" class="text-blue-600 underline">Contacts</NuxtLink>
              pour joindre un autre canard.
            </li>
            <li>
              Envoyer un message sur
              <a
                href="https://discord.com/channels/943454897431523349/1471134092497129492"
                class="text-blue-600 underline"
              >
                Discord
              </a>
            </li>
            <li>
              <a :href="`mailto:${config.public.supportEmail}`" class="text-blue-600 underline">
                Envoyer un email au support
              </a>
            </li>
          </ul>
        </FaqItem>
      </div>

      <div class="mt-8 text-center">
        <NuxtLink
          to="/"
          class="bg-secondary-600 text-white transition text-sm px-4 py-2 rounded disabled:opacity-50"
        >
          Retour au planning
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTitle: 'FAQ - Questions fréquentes',
});

const config = useRuntimeConfig();
</script>
