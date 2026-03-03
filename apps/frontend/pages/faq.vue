<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-4 m-4">
        <p class="text-gray-600">
          Retrouve ici toutes les réponses aux questions fréquentes sur le système de réservation
          des vols biplaces.
        </p>
      </div>

      <!-- Search Bar -->
      <div class="bg-white rounded-lg shadow-sm p-4 m-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher dans la FAQ..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div v-if="searchQuery" class="absolute right-3 top-2.5">
            <button @click="searchQuery = ''" class="text-gray-400 hover:text-gray-600 transition">
              ✕
            </button>
          </div>
        </div>
        <p v-if="searchQuery && filteredCount === 0" class="mt-2 text-sm text-gray-500">
          Aucun résultat trouvé pour "{{ searchQuery }}"
        </p>
        <p v-else-if="searchQuery && filteredCount > 0" class="mt-2 text-sm text-gray-500">
          {{ filteredCount }} résultat{{ filteredCount > 1 ? 's' : '' }} trouvé{{
            filteredCount > 1 ? 's' : ''
          }}
        </p>
      </div>

      <div ref="faqContainer" class="bg-white rounded-lg shadow-sm">
        <FaqItem question="1. J'aimais bien la Duck sheet" v-show="isItemVisible(0)">
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

        <FaqItem
          question="2. Quels sont les pré-requis pour obtenir un compte sur l'application ?"
          v-show="isItemVisible(1)"
        >
          <ul class="list-disc pl-6 space-y-2">
            <li>Être à jour de ta cotisation au duck parapente.</li>
            <li>
              Etre qualifié biplace ou en cours de formation (= BPC minimum et pré-formation en
              vue).
            </li>
            <li>
              Avoir LU ET signé et envoyé la
              <a href="https://drive.google.com/file/d/1GSdB7lp_31N4jSX0m7lzxjC3m1EXwyn0/view">
                charte</a
              >
              au président du Duck.
            </li>
            <li>Avoir envoyé ton chèque de caution au président du Duck.</li>
          </ul>
          <p class="mb-3">
            Si tu coches toutes les cases, tu peux demander la création de ton compte sur le channel
            discord biplace-reservations. Prévois un peu de délai.
          </p>
        </FaqItem>

        <FaqItem
          question="3. Un admin m'a créé un compte mais je n'ai pas le mot de passe..."
          v-show="isItemVisible(2)"
        >
          <p class="mb-3">
            Depuis la page d'accueil, clique sur bouton "Se connecter" puis sur "mot de passe
            oublié? ". Renseigne ton email et suis la procédure.
          </p>
        </FaqItem>

        <FaqItem question="4. Qu'est-ce qu'un Coin ?" v-show="isItemVisible(3)">
          <p>
            C'est le petit nom donné aux points qui sont attribués aux pilotes pour déterminer leur
            priorité. <strong>Plus tu as de Coins, moins tu es prioritaire.</strong> Lis la suite
            pour comprendre comment ils sont calculés.
          </p>
        </FaqItem>

        <FaqItem
          question="5. Quelle est la différence entre une demande de réservation et une réservation ?"
          v-show="isItemVisible(4)"
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
            Le passage d'une demande à une réservation est réalisée par l'application en assurant
            une équité maximale entre les pilotes (voir question "comment fonctionne l'algorithme
            d'attribution des packs ?").
          </p>
        </FaqItem>

        <FaqItem
          question="6. Comment se déroule le processus de réservation ?"
          v-show="isItemVisible(5)"
        >
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
                L'application attribue le matériel toutes les 30 minutes pour les 6 jours qui
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
                <li>À J-6 20h00, l'attribution est faite.</li>
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

        <FaqItem
          question="7. Comment fonctionne l'algorithme d'attribution des packs ?"
          v-show="isItemVisible(6)"
        >
          <p class="mb-4">Deux critères sont utilisés :</p>
          <ol class="list-decimal pl-6 mb-4 space-y-3">
            <li>
              <strong>La priorité du pilote</strong> est déterminée par le nombre de Coins (plus il
              est élevé, moins tu es prioritaire). En cas d'égalité, le pilote qui a déposé sa
              demande le premier est prioritaire. Ce critère de priorité du pilote est absolu : s'il
              existe une combinaison d'attributions pour qu'un pilote de priorité plus élevée qu'un
              autre ait du matériel, alors celle-ci est retenue.
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
                cela permet d'attribuer aussi le Pack A au Pilote 2.<br />
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
                  packs souhaités sont déjà attribués à un (des) pilote(s) encore plus prioritaires.
                  Le pilote 2 aurait pu augumenter ses chances en postulant à plus de packs.</strong
                >
              </p>
            </div>
          </div>
        </FaqItem>

        <FaqItem question="8. Comment sont comptés les Coins ?" v-show="isItemVisible(7)">
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
                  <strong>Calcul :</strong> 4+24+24+24+24+24+24 heures entre attibution et la date
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
                annulée à moins de 6 jours du jour J.
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
        </FaqItem>

        <FaqItem
          question="9. Que se passe-t-il si ma demande n'est pas validée ?"
          v-show="isItemVisible(8)"
        >
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

        <FaqItem
          question="10. Puis-je annuler ma réservation après validation ?"
          v-show="isItemVisible(9)"
        >
          <p class="mb-3">
            Bien sûr. Note cependant que ton nombre de Coins sera quand même augmenté en fonction du
            temps écoulé entre la validation et l'annulation (Voir paragraphe "Comment sont comptés
            les Coins ?"). En d'autres termes, plus tu annules tôt moins tu seras pénalisé parce que
            cela laisse plus de temps à un autre pilote pour s'organiser.
          </p>
          <p class="mt-3">
            Privilégie les demandes sur des dates où tu es vraiment certain d'être disponible pour
            voler pour éviter ce désagrément.
          </p>
        </FaqItem>

        <FaqItem
          question="11. J'ai une réservation, chez qui dois-je récupérer le matériel ?"
          v-show="isItemVisible(10)"
        >
          <p class="mb-3">Tu trouveras cette information avec le menu planning. Bon vol !</p>
        </FaqItem>

        <FaqItem question="12. Il a plu, je n'ai pas pu voler" v-show="isItemVisible(11)">
          <p class="mb-3">
            Désolé mais les Coins seront quand même comptés. Outre le fait que personne ne peut
            vérifier tes dires, tu as eu le matériel pour toi alors qu'un autre pilote aurait
            peut-être fait le choix d'un endroit où il n'a pas plu.<br />
          </p>
          <p class="mb-3">
            L'autre raison est pour limiter les réservations posées "au cas où j'aurais envie" et
            qui ne sont ni honorées ni annulées. Le principe étant de favoriser l'annulation au plus
            tôt pour permettre à d'autres pilotes de s'organiser.
          </p>
          <p class="mb-3">
            Sur le plan strict de la météo, nous sommes conscients que cela est frustrant mais tout
            le monde est soumis aux aléas météo de la même façon, cela est donc équitable dans la
            durée.
          </p>
        </FaqItem>

        <FaqItem question="13. Comment maximiser mes chances ?" v-show="isItemVisible(12)">
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
          question="14. J'ai besoin d'un bi pour une formation, un examen ou une journée club"
          v-show="isItemVisible(13)"
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

        <FaqItem
          question="15. Je veux réserver plusieurs jours consécutifs"
          v-show="isItemVisible(14)"
        >
          <p class="mb-3">
            Aujourd'hui, et probablement pour encore quelques temps, la notion de "réserver
            plusieurs jours" n'existe pas. Tu fais autant de demandes que de jours désirés et chaque
            demande est gérée indépendamment des autres.
          </p>
          <p class="mb-3">
            <strong>Exemple :</strong> Tu fais des demandes à J-7 pour samedi et dimanche, il est
            absolument possible que tu n'aies du matériel que pour samedi, que pour dimanche, pour
            samedi et dimanche mais il est possible que les matériels soient différents.
          </p>
          <p class="mb-3"><strong>Que faire dans ce cas ?</strong></p>
          <p class="mb-3">
            Nous sommes un club. Il est toujours temps de discuter pour tenter de trouver un
            arrangement avec les pilotes plus prioritaires que toi.
          </p>
          <p class="mb-3">
            Par ailleurs, si tu as du matériel affecté pour deux jours mais que ce n'est pas le
            même, contacte un canard qui a un autre matériel pour échanger l'un des deux jours. En
            cas d'accord, contacte un admin pour qu'il intervertisse les réservations (nécessaire
            pour le carnet de vol).
          </p>
          <p class="mb-3"><strong>Pro tip :</strong></p>
          <p>
            Imaginons que tu désires un biplace samedi et un dimanche. Si le lundi soir après
            l'attribution de J-6 (à 20:00), tu constates qu'un biplace est disponible pour samedi et
            dimanche. Dépose une demande pour chaque jour sur ce biplace et il te sera attribué pour
            les deux jours dans les 30 minutes sous réserve que personne de plus prioritaire ne se
            soit positionné pendant ces 30 minutes.
          </p>
        </FaqItem>

        <FaqItem
          question="16. Comment consulter mon score Coins actuel ?"
          v-show="isItemVisible(15)"
        >
          <p>
            Ton score Coins est visible sur ta
            <NuxtLink to="/mon-compte" class="text-blue-600 underline">page de profil</NuxtLink>. Il
            est mis à jour en temps réel.
          </p>
        </FaqItem>

        <FaqItem
          question="17. Pourquoi ne puis-je pas déposer de demande de réservation ?"
          v-show="isItemVisible(16)"
        >
          <p>
            Soit tu n'as pas cloturé une de tes réservations précédentes, soit ton compte est
            désactivé parce que tu n'as pas payé ton supplément de cotisation biplace annuel. <br />
            <a :href="adhesionLink" class="text-blue-600 underline">Tu peux le faire avec ce lien</a
            >. Dès que c'est fait, envoie un message
            <a
              href="https://discord.com/channels/943454897431523349/1471134092497129492"
              class="text-blue-600 underline"
            >
              sur discord</a
            >
            afin qu'admin réactive ton compte.
          </p>
        </FaqItem>

        <FaqItem
          question="18. Mon passager a surkiffé le vol et veut absolument donner de l'argent. Que dois-je faire ?"
          v-show="isItemVisible(17)"
        >
          <p>
            Pas de chance ! Tu n'agis pas dans le cadre de d'une activité professionnelle, tu ne
            peux pas encaisser d'argent pour te payer la Rolex de Rihana. Par contre, tu peux
            suggérer à ton passager de faire un don au club et ainsi le dédommager de l'usure du
            matériel.
            <br />
            A titre d'information, un vol coûte environ 20€ de frais d'achat et d'entretien.<br />
            <a :href="participationLink" class="text-blue-600 underline"
              >Ceci est le lien de l'helloasso du club.</a
            >
          </p>
          <p>
            Tu peux également lui faire flasher ce QR code pour faire un don directement depuis son
            téléphone. Il faut battre le fer tant qu'il est chaud !<br />

            <img
              src="~/assets/png/qr-participation.png"
              alt="QR Code participation biplace"
              class="w-64 h-auto mx-auto my-4 rounded-lg"
            />
          </p>
        </FaqItem>

        <FaqItem question="19. Où sont les administrateurs ?" v-show="isItemVisible(18)">
          <p class="mb-3">
            Tu peux les contacter à travers le
            <a
              href="https://discord.com/channels/943454897431523349/1471134092497129492"
              class="text-blue-600 underline"
            >
              Discord
            </a>
            ou
            <a :href="`mailto:${config.public.supportEmail}`" class="text-blue-600 underline">
              en envoyant un email au support </a
            >. Il seront très heureux de résoudre tes problèmes liés à la réservation des
            biplaces.<br />
            Pense néanmoins, qu'ils ont des métiers et qu'ils vont parfois voler. Si tu t'y prends
            une heure avant ta deadline, tu risques de rester avec ton problème.
          </p>
        </FaqItem>

        <FaqItem
          question="20. Qui puis-je contacter si j'ai d'autres questions ?"
          v-show="isItemVisible(19)"
        >
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
const { adhesionLink, participationLink } = useHelloAssoLinks();

// Search functionality
const searchQuery = ref('');
const faqContainer = ref<HTMLElement>();

const isItemVisible = (index: number) => {
  if (!searchQuery.value.trim()) {
    return true;
  }

  if (!faqContainer.value) {
    return true;
  }

  // Get the specific FaqItem component
  const faqItemElement = faqContainer.value.children[index] as any;
  if (!faqItemElement) {
    return true;
  }

  const query = searchQuery.value.toLowerCase();

  // Get text content from the FaqItem's question and content
  const questionEl = faqItemElement.querySelector('h3');
  const contentEl = faqItemElement.querySelector('.p-4');

  const questionText = questionEl?.textContent?.toLowerCase() || '';
  const contentText = contentEl?.textContent?.toLowerCase() || '';
  const searchableText = questionText + ' ' + contentText;

  return searchableText.includes(query);
};

const filteredCount = computed(() => {
  if (!faqContainer.value) {
    return 0;
  }

  if (!searchQuery.value.trim()) {
    return faqContainer.value.children.length;
  }

  let count = 0;
  for (let i = 0; i < faqContainer.value.children.length; i++) {
    if (isItemVisible(i)) {
      count++;
    }
  }
  return count;
});
</script>
