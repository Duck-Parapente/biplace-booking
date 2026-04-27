<template>
  <div
    class="relative mb-6 bg-blue-50 border border-blue-300 p-3 rounded-lg shadow-md space-y-2 cursor-pointer"
    @click="showMoreInfo = !showMoreInfo"
  >
    <span class="absolute top-2 right-2 text-lg leading-none text-blue-600">
      {{ showMoreInfo ? '➖' : '➕' }}
    </span>

    <div class="flex items-center gap-2 text-gray-800">
      <span class="text-sm text-gray-500">Respo:</span>
      <span>{{ packData.ownerFullName }}</span>
    </div>

    <div class="flex items-center gap-2 text-gray-800">
      <span class="text-sm text-gray-500">Contrôle:</span>
      <template v-if="packData.lastControlDate">
        <span>{{ formatDate(packData.lastControlDate) }}</span>
        <span
          v-if="packData.flightsMinutesSinceLastControlDate != null"
          class="text-sm text-gray-400"
        >
          ({{ Math.round(packData.flightsMinutesSinceLastControlDate / 60) }}h depuis le 1er mars)
        </span>
      </template>
      <span v-else class="text-sm text-gray-400">Non renseigné</span>
    </div>

    <div class="flex items-center gap-2 text-gray-800">
      <span class="text-sm text-gray-500">Pliage secours:</span>
      <span v-if="packData.lastRescueFoldingDate">{{
        formatDate(packData.lastRescueFoldingDate)
      }}</span>
      <span v-else class="text-sm text-gray-400">Non renseigné</span>
    </div>

    <div v-if="showMoreInfo" class="pt-2 border-t border-blue-200 space-y-2">
      <div v-if="packData.description" class="flex items-baseline gap-2 text-gray-800">
        <span class="text-sm text-gray-500">Description:</span>
        <span>{{ packData.description }}</span>
      </div>

      <div v-if="packData.details" class="text-gray-800">
        <span class="text-sm text-gray-500">Détails:</span>
        <div class="whitespace-pre-line mt-1" v-html="packData.details"></div>
      </div>

      <div class="border-t border-blue-200 pt-2 flex justify-center gap-8 text-gray-800">
        <div class="flex items-center gap-2">
          <span>✈️</span>
          <span>{{ packData.totalFlightsCount }} vols</span>
        </div>
        <div class="flex items-center gap-2">
          <span>⏱️</span>
          <span>{{ Math.round((packData.totalFlightsMinutes ?? 0) / 60) }}h</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PackReservationsDto } from 'shared';

import { formatDate } from '~/composables/useDateHelpers';

defineProps<{
  packData: PackReservationsDto;
}>();

const showMoreInfo = ref(false);
</script>
