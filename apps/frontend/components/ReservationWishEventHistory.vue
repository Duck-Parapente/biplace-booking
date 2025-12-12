<template>
  <div class="mt-2 p-2 bg-white rounded border border-gray-200 space-y-1">
    <div
      v-for="(event, index) in events"
      :key="index"
      class="flex items-center justify-between text-xs"
    >
      <div v-if="event.status" class="flex items-center gap-2">
        <span
          class="px-2 py-0.5 rounded text-xs"
          :class="getConfigFromStatus(event.status).classes"
        >
          {{ getConfigFromStatus(event.status).label }}
        </span>
      </div>
      <div v-else-if="event.cost !== undefined" class="flex items-center gap-1">
        <span class="text-gray-500 italic text-xs">Mise à jour manuelle:</span>
        <CostDisplay :cost="event.cost" />
      </div>
      <span class="text-gray-500">
        {{ formatDateTime(event.date) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ReservationWishEventDto } from 'shared';

import { formatDateTime } from '~/composables/useDateHelpers';

interface Props {
  events: ReservationWishEventDto[];
}

const props = defineProps<Props>();
const { getConfigFromStatus } = useReservationWishStatus();
</script>
