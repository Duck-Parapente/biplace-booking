<template>
  <div class="bg-white border-b border-gray-300 shadow-sm">
    <div class="flex items-center justify-between p-3 max-w-[800px] mx-auto">
      <button
        @click="$emit('previousWeek')"
        class="px-2 py-1 text-secondary-600 hover:bg-gray-100 rounded transition"
        aria-label="Semaine précédente"
      >
        <IconChevronLeft class="w-4 h-4" />
      </button>
      <div class="flex items-center gap-2">
        <p class="text-base text-secondary-600">
          {{ formatWeekRange(currentWeekStart) }}
        </p>
        <button
          @click="$emit('goToCurrentWeek')"
          class="text-blue-500 hover:text-blue-600 transition p-1 hover:bg-gray-100 rounded"
          aria-label="Revenir à la semaine actuelle"
        >
          <IconTarget class="w-4 h-4" />
        </button>
      </div>
      <button
        @click="$emit('nextWeek')"
        class="px-2 py-1 text-secondary-600 hover:bg-gray-100 rounded transition"
        aria-label="Semaine suivante"
      >
        <IconChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatWeekRange } from '~/composables/useDateHelpers';

defineProps<{
  currentWeekStart: Date;
}>();

defineEmits<{
  previousWeek: [];
  nextWeek: [];
  goToCurrentWeek: [];
}>();
</script>
