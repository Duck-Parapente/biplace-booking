<template>
  <div class="space-y-4">
    <div class="border-l-4 border-blue-500 pl-4 py-2">
      <h4 class="font-semibold text-gray-900 mb-1">📅 Faire tes demandes</h4>
      <p class="mb-3">
        Tu peux faire autant de demandes que tu le souhaites pour n'importe quelle date future. Tu
        postules pour les matériels que tu désires par ordre de priorité. Par exemple : "je préfère
        le takoo, mais si c'est le sora, il fera l'affaire mais je ne veux pas du yéti."
      </p>
    </div>

    <div class="border-l-4 border-green-500 pl-4 py-2">
      <h4 class="font-semibold text-gray-900 mb-1">✅ L'attribution du matériel</h4>
      <p class="mb-3">
        L'application attribue le matériel toutes les 30 minutes pour les 6 jours qui viennent en
        commençant à 20h00.
      </p>
      <p class="mb-3">
        En d'autres termes, le dimanche soir à 20h00, l'application prend les demandes de
        réservation pour le samedi suivant et attribue les matériels.
      </p>
      <p class="mb-3">
        Il continuera de tenter d'affecter le matériel encore disponible toutes les 30 minutes
        jusqu'au samedi soir. Cela permet de prendre en compte les annulations et les nouvelles
        demandes.
      </p>
      <p class="mb-3">
        Évidemment, ce process fonctionne pour tous les jours : Le lundi pour le dimanche, le mardi
        pour le lundi etc...
      </p>
      <p class="mb-3">En encore d'autres termes :</p>
      <ul class="list-disc pl-6 space-y-1">
        <li>Avant J-6, rien n'est attribué.</li>
        <li>À J-6 20h00, l'attribution est faite.</li>
        <li>
          À partir de J-6 20h00, tout événement qui nécessite une ré-attribution est traité dans les
          30 minutes.
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
        Une fois ton vol effectué, tu dois <strong>clôturer ta réservation</strong> en renseignant
        les informations dans ton carnet de vol. Cette clôture permettra de mettre à jour tes Coins
        pour les prochaines réservations.
      </p>
      <p class="mb-3">
        La clôture est <strong>obligatoire</strong> même si tu n'as pas volé. Tu ne pourras pas
        déposer de nouvelle demande tant qu'il te reste des vols non clos.
      </p>
    </div>
  </div>
</template>
