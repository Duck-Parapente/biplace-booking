<template>
  <div class="mt-2 py-2 bg-white rounded border border-gray-300 space-y-2" v-if="showHistory">
    <div
      v-for="(group, groupIndex) in groupedEvents"
      :key="groupIndex"
      class="pb-2 px-2 border-b border-gray-300 last:border-b-0 last:pb-0"
    >
      <div class="flex items-start justify-between gap-1">
        <div class="flex-1 space-y-1">
          <div v-for="(event, eventIndex) in group.events" :key="eventIndex">
            <div v-if="event.type === 'status'" class="flex items-center">
              <span
                class="px-2 py-0.5 rounded text-xs"
                :class="getConfigFromStatus(event.status).classes"
              >
                {{
                  (event.eventType === EventType.WISH ? 'Demande' : 'Réservation') +
                  ' ' +
                  getConfigFromStatus(event.status).label.toLowerCase()
                }}
              </span>
            </div>
            <div
              v-else-if="event.type === 'manual'"
              class="flex items-center gap-1 text-xs text-gray-400"
            >
              <span>Mise à jour manuelle des points:</span>
              <CostDisplay :cost="event.cost" />
            </div>
            <div
              v-else-if="event.type === 'automatic'"
              class="flex items-center gap-1 text-xs text-gray-400"
            >
              <span>Mise à jour automatique des points:</span>
              <CostDisplay :cost="event.cost" />
            </div>
          </div>
        </div>
        <span class="text-gray-500 text-xs whitespace-nowrap">
          {{ formatDateTimeWithSeconds(group.date) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ReservationWishStatusDto, EventType } from 'shared';

import { formatDateTimeWithSeconds } from '~/composables/useDateHelpers';

type EventItem =
  | { type: 'status'; status: ReservationWishStatusDto; date: string; eventType: EventType }
  | { type: 'manual' | 'automatic' | 'unknown'; cost: number; date: string };

interface Props {
  events: EventItem[];
  showHistory: boolean;
}

const props = defineProps<Props>();
const { getConfigFromStatus } = useReservationWishStatus();

const groupedEvents = computed(() => {
  const groups: { date: string; events: EventItem[] }[] = [];
  const THRESHOLD = 0;

  props.events.forEach((event) => {
    const eventTime = new Date(event.date).getTime();

    // Find if there's an existing group within 5 minutes
    const existingGroup = groups.find((group) => {
      const groupTime = new Date(group.date).getTime();
      return Math.abs(eventTime - groupTime) < THRESHOLD;
    });

    if (existingGroup) {
      existingGroup.events.push(event);
    } else {
      groups.push({ date: event.date, events: [event] });
    }
  });

  return groups;
});
</script>
