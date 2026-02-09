<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-4 m-4">
        <p class="text-gray-600">
          Retrouve ici toutes les réponses aux questions fréquentes sur le système de réservation
          des vols biplaces.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm">
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
            Le passage d'une demande à une réservation confirmée se fait selon le système de
            priorité par Coins (voir question suivante).
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
                <li>Avant J-5, rien n'est attribué.</li>
                <li>À J-5, l'attribution est faite.</li>
                <li>
                  À partir de J-5 20h00, tout événement qui nécessite une ré-attribution est traité
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
            <h4 class="font-semibold text-gray-900 mb-4 text-center">
              Exemple d'attribution de packs
            </h4>

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

            <!-- Flèche -->
            <div class="text-center text-2xl text-gray-400 my-4">↓</div>

            <!-- Résultat -->
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-3">✅ Attribution finale :</p>
              <div class="space-y-2">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p class="text-sm text-gray-700">Le Pack B est attribué à Pilote 1</p>
                </div>
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p class="text-sm text-gray-700">Le Pack A est attribué à Pilote 2</p>
                </div>
              </div>
            </div>

            <!-- Explication -->
            <div class="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p class="text-sm text-gray-700">
                <strong>💡 Pourquoi cette attribution ?</strong><br />
                Bien que Pilote 1 soit plus prioritaire, l'algorithme lui attribue le Pack B car
                cela permet d'attribuer aussi le Pack A au Pilote 2.
                <strong>Résultat : 2 packs attribués au lieu d'un seul</strong>.
              </p>
            </div>
          </div>
        </FaqItem>

        <FaqItem question="6. Comment sont comptés les Coins ?">
          <p class="mb-4">
            Un certain nombre de Coins sont attribués à toute demande de réservation validée. Lors
            du process d'attribution, l'application utilise la somme de Coins de toutes les
            réservations effectuées dans les <strong>365 jours qui précèdent</strong> la date
            d'attribution (une année glissante).
          </p>
          <p class="mb-4">
            Les Coins d'une réservation sont calculés lorsque celle-ci est clôturée ou annulée.
          </p>
          <p class="mb-4">
            <strong>Le nombre de Coins ajoutés</strong> = 1 Coin par jour écoulé entre l'attribution
            du matériel et la date du vol si vol il y a ou 1 Coin par jour écoulé entre
            l'attribution du matériel et l'annulation si la réservation est annulée.
          </p>

          <div class="space-y-6">
            <div>
              <h5 class="font-semibold text-gray-900 mb-3">
                ✅ Cas 1 : Tu clôtures ta réservation après le vol
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
                      <td class="text-center">10/01<br />Confirmation</td>
                      <td class="text-center"></td>
                      <td class="text-center"></td>
                      <td class="text-center"></td>
                      <td class="text-center"></td>
                      <td class="text-center">15/01<br />Vol</td>
                      <td class="text-center">16/01<br />Clôture</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <p class="text-sm">
                  <strong>Calcul :</strong> 5 jours entre la confirmation et la date du vol<br />
                  <strong>Points ajoutés :</strong> 5 Coins
                </p>
              </div>
            </div>

            <div>
              <h5 class="font-semibold text-gray-900 mb-3">⚠️ Cas 2 : Tu annules</h5>
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
                            class="w-3 h-3 bg-gray-400 rounded-full border-2 border-white relative z-10"
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
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center">10/01<br />Confirmation</td>
                      <td class="text-center"></td>
                      <td class="text-center"></td>
                      <td class="text-center"></td>
                      <td class="text-center">14/01<br />Annulation</td>
                      <td class="text-center">
                        <span class="text-gray-400">15/01<br />-</span>
                      </td>
                      <td class="text-center"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-3 p-3 bg-orange-50 rounded border border-orange-200">
                <p class="text-sm">
                  <strong>Calcul :</strong> 4 jours entre la confirmation et l'annulation<br />
                  <strong>Points ajoutés :</strong> 4 Coins
                </p>
              </div>
            </div>
          </div>
        </FaqItem>

        <FaqItem question="7. Que se passe-t-il si ma demande n'est pas validée ?">
          <p class="mb-3">
            Si ta demande n'est pas validée à J-5, cela signifie que d'autres pilotes avec un nombre
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

        <FaqItem question="8. Puis-je annuler ou modifier ma réservation après validation ?">
          <p class="mb-3">Oui, tu peux annuler une réservation validée. Cependant :</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              Ton nombre de Coins sera augmenté en fonction du nombre de jours entre la validation
              et l'annulation.
            </li>
            <li>En d'autres termes, plus tu annules tôt moins tu seras pénalisé.</li>
            <li>L'annulation libère le biplace pour d'autres pilotes en attente.</li>
          </ul>
          <p class="mt-3">
            Privilégie les demandes sur des dates où tu es vraiment disponible pour voler.
          </p>
        </FaqItem>

        <FaqItem question="9. Il a plu, je n'ai pas pu voler">
          <p class="mb-3">
            Désolé mais les Coins seront quand même comptés. Outre le fait que personne ne peut
            vérifier tes dires, tu as eu le matériel pour toi alors qu'un autre pilote aurait
            peut-être fait le choix d'un endroit où il n'a pas plu.
          </p>
          <p class="mb-3">
            Nous sommes conscients que cela est frustrant mais tout le monde est soumis aux aléas
            météo de la même façon, cela est donc équitable dans le temps.
          </p>
        </FaqItem>

        <FaqItem question="10. Comment maximiser mes chances ?">
          <ul class="list-disc pl-6 space-y-3">
            <li>
              <strong>Gère tes demandes :</strong> Nous sommes le 1er jour du mois, tu as demandé un
              pack pour le 4. Aucun pack ne t'a été attribué. Tant qu'un biplace t'intéresse,
              conserve ta demande pour le 4. Si le pilote à qui il est attribué se désiste, il te
              sera peut-être attribué. Par contre, si le 2, tu décides que comme tu n'as pas de
              biplace, tu iras grimper avec tes potes, annule ta demande. Dans le cas contraire, si
              le pilote à qui il est attribué se désiste, il te sera peut-être attribué et tu seras
              redevable d'au moins un Coin même si tu l'annules rapidement.
            </li>
            <li>
              <strong>Postule à tous les biplaces qui t'intéressent</strong> plutôt qu'à un seul.
            </li>
            <li>
              <strong>Postule aux jours avec une faible demande.</strong> Typiquement, en semaine.
            </li>
            <li>
              <strong>Réserver plus tard que J-5 coûte moins cher mais est plus risqué.</strong> Ça
              peut être une stratégie plus économique dans les périodes de faible demande.
            </li>
            <li>
              <strong>Si tu sens que la météo va tourner au vinaigre,</strong> annule ta réservation
              le plus tôt possible, cela coûte moins de Coins que la veille ou le jour même.
            </li>
            <li>
              <strong>Réserver peu</strong> permet d'avoir plus de choix dans la date et d'augmenter
              la probabilité d'avoir du matériel plusieurs jours consécutifs (voir plus bas).
            </li>
          </ul>
        </FaqItem>

        <FaqItem
          question="11. J'ai besoin d'un bi pour une formation, un examen ou une journée club"
        >
          <p class="mb-3">
            Ces événements sont prioritaires par rapport au système de Coins. Contacte un
            administrateur pour qu'il valide ta demande de réservation avant J-5. Le plus tôt
            possible est le mieux.
          </p>
          <p>
            Après J-5, il te faudra soit postuler sur un matériel disponible soit négocier avec les
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
                href="https://discord.com/channels/943454897431523349/943504854746271794"
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
