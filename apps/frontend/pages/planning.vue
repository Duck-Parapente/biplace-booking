<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <!-- Week Selector - Fixed at top -->
    <PlanningWeekSelector v-model="currentWeekStart" />

    <div class="flex-1 p-2 max-w-[800px] mx-auto w-full flex flex-col min-h-0 mb-16">
      <div class="flex-1 overflow-y-auto pb-2">
        <div class="space-y-1.5">
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
      </div>
    </div>

    <!-- Pack Filter Tags - Fixed at bottom -->
    <PlanningPackFilter
      :sorted-packs="sortedPacks"
      :selected-packs="selectedPacks"
      @toggle-pack="togglePack"
    />

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
import type { CreateReservationDto } from 'shared';
import { UserRoles } from 'shared';
import { ref, computed, watch, onMounted } from 'vue';

import IconPlus from '~/components/icons/IconPlus.vue';
import { getMonday, getWeekDays, formatDateToString } from '~/composables/useDateHelpers';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Planning',
});

const { packs, planningDays, fetchPlanning } = usePlanning();
const { getUsers, getUser } = useUser();
const { hasRole } = useAuth();
const { getPacks } = usePack();
const { resetSubmissionState } = useReservationForm();

const currentWeekStart = ref<Date>(getMonday(new Date()));
const week = computed(() => getWeekDays(currentWeekStart.value));

// Check if user has Admin or Manager role
const isAdminOrManager = computed(() => {
  return hasRole(UserRoles.ADMIN) || hasRole(UserRoles.MANAGER);
});

// Create Reservation Modal
const showCreateReservationModal = ref(false);
const createReservationForm = ref<CreateReservationDto>({
  startingDate: formatDateToString(new Date()),
  packId: '',
});

const openCreateReservationModal = () => {
  createReservationForm.value = {
    startingDate: formatDateToString(new Date()),
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

// Selected packs filter
const selectedPacks = ref<Set<string>>(new Set());

// Sorted packs for display
const sortedPacks = computed(() => {
  return [...packs.value].sort((a, b) => a.packLabel.localeCompare(b.packLabel));
});

// Fetch planning when week changes
watch(currentWeekStart, async () => {
  await refreshPlanning();

  // Select all packs by default if none selected
  if (selectedPacks.value.size === 0) {
    selectedPacks.value = new Set(packs.value.map((p) => p.packId));
  }
});

// Initial fetch
onMounted(async () => {
  await Promise.all([refreshPlanning(), getUsers(), getUser(), getPacks()]);

  // Select all packs by default if none selected
  if (selectedPacks.value.size === 0) {
    selectedPacks.value = new Set(packs.value.map((p) => p.packId));
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

const togglePack = (packId: string) => {
  const set = selectedPacks.value;
  set.has(packId) ? set.delete(packId) : set.add(packId);
};

const toggleDay = (dateKey: string) => {
  const set = expandedDays.value;
  set.has(dateKey) ? set.delete(dateKey) : set.add(dateKey);
};
</script>
