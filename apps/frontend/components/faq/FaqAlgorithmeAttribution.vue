<template>
  <div>
    <p class="mb-4">Deux critères sont utilisés :</p>
    <ol class="list-decimal pl-6 mb-4 space-y-3">
      <li>
        <strong>La priorité du pilote</strong> est déterminée par le nombre de Coins (plus il est
        élevé, moins tu es prioritaire). En cas d'égalité, le pilote qui a déposé sa demande le
        premier est prioritaire. Ce critère de priorité du pilote est absolu : s'il existe une
        combinaison d'attributions pour qu'un pilote de priorité plus élevée qu'un autre ait du
        matériel, alors celle-ci est retenue.
      </li>
      <li>
        <strong>Le critère de priorité dans les souhaits de pack.</strong> Ce critère est secondaire
        : parmi les solutions qui répondent au critère ci-dessus, l'algo choisit celle qui satisfait
        au mieux les pilotes les plus prioritaires.
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
          Les deux pilotes demandent les même packs. Pilote 1 est plus prioritaire, l'algorithme lui
          attribue son pack préféré (A) et attribue à Pilote 2 le Pack restant (B).<br />
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
          Bien que Pilote 1 soit plus prioritaire, l'algorithme lui attribue le Pack B car cela
          permet d'attribuer aussi le Pack A au Pilote 2.<br />
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
          Bien que le pilote 2 soit plus prioritaire que le pilote 3, l'algorithme ne lui attribue
          aucun pack parce que le seul qu'il désirait (A) est déjà attribué au pilote 1 plus
          prioritaire. <br />
          Le pilote 3 reçoit le pack B qu'il avait mis en second choix.<br />
          <strong
            >Résultat : Une demande plus prioritaire n'est pas satisfaite parce que tous les packs
            souhaités sont déjà attribués à un (des) pilote(s) encore plus prioritaires. Le pilote 2
            aurait pu augumenter ses chances en postulant à plus de packs.</strong
          >
        </p>
      </div>
    </div>
  </div>
</template>
