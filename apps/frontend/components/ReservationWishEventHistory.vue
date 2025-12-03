<template>
  <div class="mt-2 p-2 bg-white rounded border border-gray-200 space-y-1">
    <div
      v-for="(event, index) in events"
      :key="index"
      class="flex items-center justify-between text-xs"
    >
      <span class="px-2 py-0.5 rounded text-xs" :class="getConfigFromStatus(event.status).classes">
        {{ getEventLabel(event) }}
      </span>
      <span class="text-gray-500">
        {{ formatDateTime(event.date) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ReservationEventTypeDto,
  type ReservationWishEventDto,
} from 'shared';

import { formatDateTime } from '~/composables/useDateHelpers';

interface Props {
  events: ReservationWishEventDto[];
}

const props = defineProps<Props>();
const { getConfigFromStatus } = useReservationWishStatus();

const getEventLabel = (event: ReservationWishEventDto): string => {
  return [
    event.type === ReservationEventTypeDto.WISH ? 'Demande' : 'Réservation',
    getConfigFromStatus(event.status).label.toLowerCase(),
  ].join(' ');
};
</script>
