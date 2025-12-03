<template>
  <div class="flex gap-2 mb-4 flex-wrap">
    <button
      v-for="status in availableStatuses"
      :key="status"
      @click="$emit('toggle', status)"
      class="px-3 py-1.5 text-sm font-medium rounded-lg transition"
      :class="
        selectedStatuses.has(status)
          ? 'bg-secondary-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      "
    >
      {{ getStatusLabel(status) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ReservationOrWishStatusDto } from 'shared';

interface Props {
  availableStatuses: ReservationOrWishStatusDto[];
  selectedStatuses: Set<ReservationOrWishStatusDto>;
}

defineProps<Props>();

defineEmits<{
  toggle: [status: ReservationOrWishStatusDto];
}>();

const { getStatusLabel } = useReservationWishStatus();

</script>
