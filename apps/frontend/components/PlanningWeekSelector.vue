<template>
  <div class="bg-gray-50">
    <div class="flex items-center justify-between p-2 max-w-[800px] mx-auto">
      <button
        @click="previousWeek"
        class="px-2 py-1 text-gray-600 hover:text-secondary-600 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
        aria-label="Semaine précédente"
      >
        <IconChevronLeft class="w-4 h-4" />
      </button>
      <div class="flex items-center gap-2">
        <p class="text-base font-medium text-gray-700">
          {{ formatWeekRange(currentWeekStart) }}
        </p>
        <button
          @click="goToCurrentWeek"
          :disabled="isCurrentWeek"
          :class="
            isCurrentWeek ? 'text-gray-400' : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
          "
          class="transition-all duration-200 p-1 rounded-lg"
          aria-label="Revenir à la semaine actuelle"
        >
          <IconTarget class="w-4 h-4" />
        </button>
      </div>
      <button
        @click="nextWeek"
        class="px-2 py-1 text-gray-600 hover:text-secondary-600 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
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

const isCurrentWeek = computed(
  () => currentWeekStart.value.toDateString() === getMonday(new Date()).toDateString(),
);

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
