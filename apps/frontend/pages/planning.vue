<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <!-- Week Selector - Fixed at top -->
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

    <div class="flex-1 p-2 max-w-[800px] mx-auto w-full flex flex-col min-h-0 mb-16">
      <div class="flex-1 overflow-y-auto pb-2">
        <div class="space-y-1.5">
          <!-- Day Card -->
          <div
            v-for="day in filteredPlanningDays"
            :key="day.date.toString()"
            :class="[
              'border bg-white rounded shadow-sm',
              isToday(day.date) ? 'border-blue-300 border-2' : 'border-gray-300',
            ]"
          >
            <div
              @click="toggleDay(day.date.toString())"
              class="px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition"
              :class="expandedDays.has(day.date.toString()) ? 'border-b border-gray-200' : ''"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-secondary-600">
                  {{ formatDateLong(day.date) }}
                </h3>
                <IconChevronRight
                  class="w-4 h-4 transition-transform"
                  :class="expandedDays.has(day.date.toString()) ? 'rotate-90' : ''"
                />
              </div>

              <!-- Pack Status Tags (when collapsed) -->
              <div v-if="!expandedDays.has(day.date.toString())" class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="pack in day.packs"
                  :key="pack.packId"
                  class="px-2 py-0.5 text-xs rounded"
                  :class="getPackStatusConfig(pack).backgroundClass"
                >
                  {{ pack.packLabel }}
                </span>
              </div>
            </div>

            <div v-show="expandedDays.has(day.date.toString())" class="p-2 space-y-1.5">
              <!-- Pack Slot -->
              <div
                v-for="pack in day.packs"
                :key="pack.packId"
                class="border border-gray-200 rounded p-2 bg-gray-50"
              >
                <div class="flex items-start justify-between gap-2">
                  <span class="text-sm text-secondary-600">{{ pack.packLabel }}</span>

                  <div class="flex flex-col items-end gap-1">
                    <div
                      class="flex items-center gap-1 px-2 py-1 rounded text-sm"
                      :class="getPackStatusConfig(pack).backgroundClass"
                    >
                      <component :is="getPackStatusConfig(pack).icon" class="w-3 h-3" />
                      <span>{{ getPackStatusConfig(pack).label }}</span>
                    </div>

                    <!-- User Contact Info -->
                    <div
                      v-if="pack.reservation"
                      class="space-y-0.5 text-xs text-gray-600 text-right"
                    >
                      <div v-if="getPackStatusConfig(pack).email">
                        <a
                          :href="`mailto:${getPackStatusConfig(pack).email}`"
                          class="hover:underline"
                        >
                          {{ getPackStatusConfig(pack).email }}
                        </a>
                      </div>
                      <div v-if="getPackStatusConfig(pack).phone">
                        <a :href="`tel:${getPackStatusConfig(pack).phone}`" class="hover:underline">
                          {{ getPackStatusConfig(pack).phone }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Public Comment -->
                <div
                  v-if="pack.reservation?.publicComment"
                  class="mt-1.5 text-xs text-gray-700 italic"
                >
                  "{{ pack.reservation.publicComment }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pack Filter Tags - Fixed at bottom -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg">
      <div class="overflow-x-auto px-3 py-2 max-w-[800px] mx-auto">
        <div class="flex gap-1.5 min-w-min">
          <button
            v-for="pack in sortedPacks"
            :key="pack.packId"
            @click="togglePack(pack.packId)"
            class="px-2.5 py-1 text-sm rounded transition whitespace-nowrap flex-shrink-0"
            :class="
              selectedPacks.has(pack.packId)
                ? 'bg-secondary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            "
          >
            {{ pack.packLabel }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PackPlanningDto, UserDto } from 'shared';
import { ref, computed, watch, onMounted } from 'vue';

import {
  formatDateLong,
  isToday,
  formatWeekRange,
  getMonday,
  getWeekDays,
} from '~/composables/useDateHelpers';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Planning',
});

const { packs, planningDays, fetchPlanning } = usePlanning();
const { getUsers } = useUser();
const { getUserDisplayName } = useUserHelpers();

const users = ref<UserDto[]>([]);

// Selected packs filter
const selectedPacks = ref<Set<string>>(new Set());

// Sorted packs for display
const sortedPacks = computed(() => {
  return [...packs.value].sort((a, b) => a.packLabel.localeCompare(b.packLabel));
});

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
  await Promise.all([
    fetchPlanning(weekDays[0]!, weekDays[6]!),
    getUsers().then((data) => (users.value = data)),
  ]);

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

const getReservedUser = (userId: string | undefined) => {
  if (!userId) return undefined;
  return users.value.find((u) => u.id === userId);
};

const getPackStatusConfig = (pack: PackPlanningDto) => {
  if (pack.reservation) {
    const user = getReservedUser(pack.reservation.userId);
    return {
      backgroundClass: 'bg-red-100 text-red-800',
      icon: 'IconUser',
      label: getUserDisplayName(user),
      phone: user?.phoneNumber,
      email: user?.email,
    };
  }
  if (pack.pendingWishesCount > 0) {
    return {
      backgroundClass: 'bg-orange-100 text-orange-800',
      icon: 'IconClock',
      label: `${pack.pendingWishesCount} ${pack.pendingWishesCount > 1 ? 'demandes' : 'demande'}`,
    };
  }
  return {
    backgroundClass: 'bg-green-100 text-green-800',
    icon: 'IconCheck',
    label: 'Disponible',
  };
};
</script>
