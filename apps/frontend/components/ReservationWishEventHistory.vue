<template>
  <div class="mt-2 p-2 bg-white rounded border border-gray-200 space-y-3">
    <div
      v-for="(group, groupIndex) in groupedEvents"
      :key="groupIndex"
      class="pb-3 border-b border-gray-200 last:border-b-0 last:pb-0"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 space-y-1">
          <div v-for="(event, eventIndex) in group.events" :key="eventIndex">
            <div v-if="event.type === 'status'" class="flex items-center gap-2">
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
            <div v-else-if="event.type === 'cost'" class="flex items-center gap-1 italic text-xs">
              <span class="text-gray-500">Canardos mis à jour:</span>
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
  | { type: 'cost'; cost: number; date: string };

interface Props {
  events: EventItem[];
}

const props = defineProps<Props>();
const { getConfigFromStatus } = useReservationWishStatus();

const groupedEvents = computed(() => {
  const groups: { date: string; events: EventItem[] }[] = [];
  const ONE_SECOND_MS = 1 * 60 * 1000;

  props.events.forEach((event) => {
    const eventTime = new Date(event.date).getTime();

    // Find if there's an existing group within 5 minutes
    const existingGroup = groups.find((group) => {
      const groupTime = new Date(group.date).getTime();
      return Math.abs(eventTime - groupTime) < ONE_SECOND_MS;
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
