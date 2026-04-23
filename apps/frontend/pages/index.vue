<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <PlanningWeekSelector v-model="currentWeekStart" @next="nextWeek" @previous="previousWeek" />
    <PlanningPackFilter
      :sorted-packs="packs"
      :selected-packs="selectedPacks"
      @toggle-pack="togglePack"
    />

    <div
      ref="swipeContainer"
      class="flex-1 p-2 max-w-[800px] mx-auto w-full flex flex-col min-h-0 mb-16"
    >
      <div class="flex-1 overflow-y-auto pb-2 relative">
        <Transition :name="transitionName" mode="out-in">
          <div :key="currentWeekStart.toISOString()" class="space-y-1.5">
            <!-- Day Card -->
            <PlanningDayCard
              v-for="day in filteredPlanningDays"
              :key="day.date.toString()"
              :day="day"
              :is-expanded="expandedDays.has(day.date.toString())"
              @toggle-expanded="toggleDay(day.date.toString())"
              @after-cancel-reservation="refreshPlanning"
            />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Create Reservation Button - Fixed bottom right (only for Admin/Manager) -->
    <button
      v-if="isAdminOrManager"
      @click="openCreateReservationModal"
      class="fixed bottom-4 right-4 bg-secondary-600 text-white rounded-full p-4 shadow-lg hover:bg-secondary-700 transition z-50"
      aria-label="Créer une réservation"
    >
      <IconPlus class="w-6 h-6" />
    </button>

    <!-- Create Reservation Modal -->
    <CreateReservationModal
      :show="showCreateReservationModal"
      v-model="createReservationForm"
      @close="closeCreateReservationModal"
      @submit="refreshPlanning"
    />
  </main>
</template>

<script setup lang="ts">
import { useSwipe } from '@vueuse/core';
import { ref, computed, watch, onMounted } from 'vue';

import IconPlus from '~/components/icons/IconPlus.vue';
import { getMonday, getWeekDays, formatDateToString } from '~/composables/useDateHelpers';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Planning',
});

const { packs, planningDays, fetchPlanning } = usePlanning();
const { getUsers, getUser } = useUser();
const { isAdminOrManager } = useAuth();
const { getPacks } = usePack();
const { resetSubmissionState } = useReservationForm();
const { selectedPacks, togglePack, setSelectedPacks } = useSelectedPacks();

const currentWeekStart = ref<Date>(getMonday(new Date()));
const week = computed(() => getWeekDays(currentWeekStart.value));

// Transition state and direction
const isTransitioning = ref(false);
const transitionName = ref('slide-left');

// Week navigation functions
function nextWeek() {
  transitionName.value = 'slide-left';
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() + 7);
  currentWeekStart.value = newDate;
}

function previousWeek() {
  transitionName.value = 'slide-right';
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() - 7);
  currentWeekStart.value = newDate;
}

// Swipe functionality
const swipeContainer = ref<HTMLElement | null>(null);
const { direction } = useSwipe(swipeContainer, {
  onSwipeEnd(e: TouchEvent, direction: 'left' | 'right' | 'up' | 'down' | 'none') {
    if (direction === 'left') {
      nextWeek();
    } else if (direction === 'right') {
      previousWeek();
    }
  },
});

// Create Reservation Modal
const showCreateReservationModal = ref(false);
const createReservationForm = ref({
  startingDate: formatDateToString(new Date()),
  endDate: formatDateToString(new Date()),
  packId: '',
});

const openCreateReservationModal = () => {
  createReservationForm.value = {
    startingDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
    packId: '',
  };
  showCreateReservationModal.value = true;
};

const closeCreateReservationModal = () => {
  resetSubmissionState();
  showCreateReservationModal.value = false;
};

const refreshPlanning = async () => {
  await fetchPlanning(week.value.monday, week.value.sunday);
};

// Fetch planning when week changes
watch(currentWeekStart, async () => {
  isTransitioning.value = true;
  await refreshPlanning();
  isTransitioning.value = false;

  // Select all packs by default if none selected
  if (selectedPacks.value.size === 0) {
    setSelectedPacks(packs.value.map((p) => p.packId));
  }
});

// Initial fetch
onMounted(async () => {
  await Promise.all([refreshPlanning(), getUsers(), getUser(), getPacks()]);

  // Select all packs by default if none selected
  if (selectedPacks.value.size === 0) {
    setSelectedPacks(packs.value.map((p) => p.packId));
  }
});

const filteredPlanningDays = computed(() => {
  return planningDays.value.map(({ packs, date }) => {
    // Filter packs based on selected packs
    const filteredPacks = packs.filter((pack) => selectedPacks.value.has(pack.packId));

    return {
      date,
      packs: filteredPacks,
    };
  });
});

const expandedDays = ref<Set<string>>(new Set());

const toggleDay = (dateKey: string) => {
  const set = expandedDays.value;
  set.has(dateKey) ? set.delete(dateKey) : set.add(dateKey);
};
</script>

<style scoped>
/* Slide left transition (next week) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide right transition (previous week) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
