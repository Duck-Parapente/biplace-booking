<template>
  <div class="bg-white border-b border-gray-300 shadow-sm">
    <div class="flex items-center justify-between p-3 max-w-[800px] mx-auto">
      <button
        @click="previousWeek"
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
          @click="goToCurrentWeek"
          class="text-blue-500 hover:text-blue-600 transition p-1 hover:bg-gray-100 rounded"
          aria-label="Revenir à la semaine actuelle"
        >
          <IconTarget class="w-4 h-4" />
        </button>
      </div>
      <button
        @click="nextWeek"
        class="px-2 py-1 text-secondary-600 hover:bg-gray-100 rounded transition"
        aria-label="Semaine suivante"
      >
        <IconChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatWeekRange, getMonday } from '~/composables/useDateHelpers';

const currentWeekStart = defineModel<Date>({ required: true });

function previousWeek() {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() - 7);
  currentWeekStart.value = newDate;
}

function nextWeek() {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() + 7);
  currentWeekStart.value = newDate;
}

function goToCurrentWeek() {
  currentWeekStart.value = getMonday(new Date());
}
</script>
