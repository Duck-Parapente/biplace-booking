<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-4">
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <p class="text-gray-600">
          Retrouve ici toutes les réponses aux questions fréquentes sur le système de réservation
          des vols biplaces.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <FaqItem
          question="Quelle est la différence entre une demande de réservation et une réservation ?"
        >
          <p class="mb-3">
            <strong class="text-gray-900">Une demande de réservation</strong> est ton souhait de
            voler à une date précise. C'est la première étape du processus. Tu exprimes ton
            intention pour un ou plusieurs packs, mais ce n'est pas encore confirmé.
          </p>
          <p class="mb-3">
            <strong class="text-gray-900">Une réservation</strong> est une demande qui a été validée
            et confirmée. Tu as alors un créneau garanti pour voler avec un pack attribué.
          </p>
          <p>
            Le passage d'une demande à une réservation se fait selon le système de priorité par
            canardos (voir question suivante).
          </p>
        </FaqItem>

        <FaqItem question="Comment fonctionne le système de canardos ?">
          <p class="mb-3">
            Le système de canardos permet de gérer équitablement les priorités entre tous les
            pilotes qui souhaitent voler.
          </p>

          <h4 class="font-semibold text-gray-900 mt-4 mb-2">Pourquoi ce système ?</h4>
          <p class="mb-3">Nous avons mis en place ce système pour :</p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Garantir une répartition équitable des créneaux de vol</li>
            <li>Éviter qu'une même personne monopolise toujours les mêmes jours</li>
            <li>
              Donner leur chance à tous les pilotes, même ceux qui réservent moins fréquemment
            </li>
            <li>Automatiser et rendre transparent le processus de validation des demandes</li>
            <li>Maximiser le nombre de packs attribués</li>
          </ul>

          <h4 class="font-semibold text-gray-900 mt-4 mb-2">Comment évoluent tes canardos ?</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>Ton score augmente</strong> à chaque réservation clôturée ou annulée (nombre
              de jours entre la création de la réservation et l'action)
            </li>
            <li>
              <strong>Plus ton score est élevé, moins tu es prioritaire</strong> - cela signifie que
              tu as déjà beaucoup réservé sur les 12 derniers mois
            </li>
            <li>Plus ton score est bas, plus tu es prioritaire pour obtenir une réservation</li>
            <li>Cela permet aux personnes n'ayant pas volé récemment d'être avantagées</li>
          </ul>
        </FaqItem>

        <FaqItem question="Comment se déroule le processus de réservation ?">
          <div class="space-y-4">
            <div class="border-l-4 border-blue-500 pl-4 py-2">
              <h4 class="font-semibold text-gray-900 mb-1">
                📅 Plus de 5 jours avant la date souhaitée
              </h4>
              <p>
                <strong>Période de dépôt des demandes de réservation</strong><br />
                Tout le monde peut faire une demande de réservation pour exprimer ses souhaits de
                vol. Tu peux créer autant de demandes que tu le souhaites, aucune validation n'est
                effectuée pendant cette période.
              </p>
            </div>

            <div class="border-l-4 border-green-500 pl-4 py-2">
              <h4 class="font-semibold text-gray-900 mb-1">✅ À J-5 à 20h00</h4>
              <p>
                <strong>Premier calcul automatique et attribution des packs</strong><br />
                Un algorithme détermine la meilleure combinaison possible pour attribuer les packs
                disponibles en fonction :
              </p>
              <ul class="list-disc pl-6 mt-2 space-y-1">
                <li>Des demandes de réservation de tous les pilotes</li>
                <li>
                  Du score canardos de chaque pilote (plus le score est bas, plus tu es prioritaire)
                </li>
                <li>De la disponibilité des packs</li>
                <li>De l'optimisation pour maximiser le nombre de réservations attribuées</li>
              </ul>
              <p class="mt-2">
                Les demandes sélectionnées deviennent des <strong>réservations confirmées</strong>.
                Les autres demandes sont refusées.
              </p>
            </div>

            <div class="border-l-4 border-green-500 pl-4 py-2">
              <h4 class="font-semibold text-gray-900 mb-1">🔄 Entre J-4 et J-1</h4>
              <p>
                <strong>Recalculs automatiques en cas de changement</strong><br />
                Si un créneau se libère (annulation d'une réservation) ou qu'une nouvelle demande
                est créée, l'algorithme est automatiquement relancé après un délai de 10 minutes.
                Cela permet de réattribuer les créneaux disponibles aux demandes en attente.
              </p>
            </div>

            <div class="border-l-4 border-orange-500 pl-4 py-2">
              <h4 class="font-semibold text-gray-900 mb-1">🎯 Après la date de la réservation</h4>
              <p>
                Une fois ton vol effectué, tu peux <strong>clôturer ta réservation</strong> en
                renseignant les informations dans ton carnet de vol. Cette clôture permettra de
                mettre à jour ton score canardos pour les prochaines réservations.
              </p>
            </div>
          </div>
        </FaqItem>

        <FaqItem question="Comment fonctionne l'algorithme d'attribution des packs ?">
          <p class="mb-4">
            L'algorithme cherche à <strong>maximiser le nombre de réservations attribuées</strong>
            tout en respectant les priorités. Voici un exemple simple :
          </p>

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
                      Score: 50 canardos (plus prioritaire)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Demande : Pack A ou Pack B</div>
                </div>
                <div class="bg-white p-3 rounded border-l-4 border-orange-500">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Pilote 2</span>
                    <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Score: 120 canardos (moins prioritaire)
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

          <p class="text-sm text-gray-600 italic">
            L'algorithme évalue toutes les combinaisons possibles pour trouver celle qui maximise le
            nombre de réservations tout en respectant au mieux les priorités.
          </p>
        </FaqItem>

        <FaqItem question="Que se passe-t-il si ma demande n'est pas validée ?">
          <p class="mb-3">
            Si ta demande n'est pas validée à J-1, cela signifie que d'autres pilotes avec un score
            canardos plus bas ont été prioritaires sur les créneaux disponibles.
          </p>
          <p class="mb-3">
            <strong>Tes options :</strong>
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              Ta demande reste en attente si des créneaux se libèrent (annulation d'une autre
              réservation)
            </li>
            <li>Tu peux modifier ta demande pour choisir une autre date</li>
            <li>
              Ton score reste inchangé et tu seras plus prioritaire la prochaine fois (si d'autres
              font des réservations entre temps)
            </li>
          </ul>
        </FaqItem>

        <FaqItem question="Puis-je annuler ou modifier ma réservation après validation ?">
          <p class="mb-3">Oui, tu peux annuler une réservation validée. Cependant :</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              Ton score canardos augmentera en fonction du nombre de jours entre la création et
              l'annulation
            </li>
            <li>L'annulation libère le créneau pour d'autres pilotes en attente</li>
          </ul>
          <p class="mt-3">
            Privilégie les demandes sur des dates où tu es vraiment disponible pour voler.
          </p>
        </FaqItem>

        <FaqItem question="Comment consulter mon score canardos actuel ?">
          <p>
            Ton score canardos est visible sur ta
            <NuxtLink to="/mon-compte" class="text-blue-600 underline">page de profil</NuxtLink>. Il
            est mis à jour en temps réel.
          </p>
        </FaqItem>

        <FaqItem question="Qui puis-je contacter si j'ai d'autres questions ?">
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
          to="/planning"
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
