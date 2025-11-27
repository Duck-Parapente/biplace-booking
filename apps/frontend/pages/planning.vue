<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-2 max-w-[800px] mx-auto w-full flex flex-col min-h-0 mb-8">
      <!-- Pack Filter Tags -->
      <div class="flex gap-1.5 mb-2 flex-wrap">
        <button
          v-for="pack in packs"
          :key="pack.packId"
          @click="togglePack(pack.packId)"
          class="px-2.5 py-1 text-sm rounded transition"
          :class="
            selectedPacks.has(pack.packId)
              ? 'bg-secondary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
        >
          {{ pack.packLabel }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pb-2">
        <div class="space-y-1.5">
          <!-- Day Card -->
          <div
            v-for="day in filteredPlanningDays"
            :key="day.date.toString()"
            :class="[
              'border bg-white rounded shadow-sm',
              isToday(day.date) ? 'border-blue-500 border-2' : 'border-gray-300',
            ]"
          >
            <div class="px-3 py-1.5 border-b border-gray-200">
              <h3 class="text-base font-semibold text-secondary-600">
                {{ formatDateLong(day.date) }}
              </h3>
            </div>

            <div class="p-2 space-y-1.5">
              <!-- Pack Slot -->
              <div
                v-for="pack in day.packs"
                :key="pack.packId"
                class="border border-gray-200 rounded p-2 bg-gray-50"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm text-secondary-600">{{ pack.packLabel }}</span>

                  <!-- Pending Wishes Count (Orange) -->
                  <div
                    v-if="pack.pendingWishesCount > 0"
                    class="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm"
                  >
                    <IconClock class="w-3 h-3" />
                    <span>{{ pack.pendingWishesCount }}</span>
                    <span>{{ pack.pendingWishesCount > 1 ? 'demandes' : 'demande' }}</span>
                  </div>

                  <!-- Reservation (Red) -->
                  <div
                    v-if="pack.reservation"
                    class="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                  >
                    <IconUser class="w-3 h-3" />
                    <span>{{ pack.reservation.username }}</span>
                  </div>

                  <!-- Available Slot (Green) -->
                  <div
                    v-if="!pack.reservation && pack.pendingWishesCount === 0"
                    class="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                  >
                    <IconCheck class="w-3 h-3" />
                    <span>Disponible</span>
                  </div>
                </div>

                <!-- Public Comment -->
                <div v-if="pack.reservation?.comment" class="mt-1.5 text-xs text-gray-700 italic">
                  "{{ pack.reservation.comment }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Week Selector - Fixed at bottom -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg">
      <div class="flex items-center justify-between p-2 max-w-[800px] mx-auto">
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
  </main>
</template>

<script setup lang="ts">
import type { PackPlanningDto } from 'shared';
import { ref, computed, watch } from 'vue';

import {
  formatDateLong,
  isToday,
  formatWeekRange,
  formatDateToString,
  getMonday,
  getWeekDays,
} from '~/composables/useDateHelpers';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Planning',
});

const { packs, planningDays, fetchPlanning } = usePlanning();

// Selected packs filter
const selectedPacks = ref<Set<string>>(new Set());

// Week management
const currentWeekStart = ref<Date>(getMonday(new Date()));

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

// Fetch planning when week changes
watch(currentWeekStart, async () => {
  const weekDays = getWeekDays(currentWeekStart.value);
  await fetchPlanning(weekDays[0]!, weekDays[6]!);

  // Select all packs by default if none selected
  if (selectedPacks.value.size === 0) {
    selectedPacks.value = new Set(packs.value.map((p) => p.packId));
  }
});

// Initial fetch
onMounted(async () => {
  const weekDays = getWeekDays(currentWeekStart.value);
  await fetchPlanning(weekDays[0]!, weekDays[6]!);

  // Select all packs by default if none selected
  if (selectedPacks.value.size === 0) {
    selectedPacks.value = new Set(packs.value.map((p) => p.packId));
  }
});
const filteredPlanningDays = computed(() => {
  const weekDays = getWeekDays(currentWeekStart.value);

  return weekDays.map((date) => {
    const dateString = formatDateToString(date);
    const existingDay = planningDays.value.find(
      (d) => formatDateToString(new Date(d.date)) === dateString,
    );

    // Get all selected packs and create slots for them
    const filteredPacks: PackPlanningDto[] = Array.from(selectedPacks.value).map((packId) => {
      const pack = packs.value.find((p) => p.packId === packId);
      const existingPack = existingDay?.packs.find((p) => p.packId === packId);

      if (existingPack) {
        return existingPack;
      }

      // Create a default available slot if no data exists
      return {
        packId,
        packLabel: pack?.packLabel || packId,
        pendingWishesCount: 0,
        reservation: null,
      };
    });

    return {
      date,
      packs: filteredPacks,
    };
  });
});

const togglePack = (packId: string) => {
  const set = selectedPacks.value;
  set.has(packId) ? set.delete(packId) : set.add(packId);
};
</script>
