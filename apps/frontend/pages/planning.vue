<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-6xl mx-auto w-full flex flex-col min-h-0">
      <h2 class="text-2xl font-semibold mb-4 text-secondary-600">Planning</h2>

      <!-- Week Selector -->
      <div
        class="flex items-center justify-between mb-4 bg-white p-3 rounded-lg border border-gray-300"
      >
        <button
          @click="previousWeek"
          class="px-3 py-2 text-secondary-600 hover:bg-gray-100 rounded transition"
          aria-label="Semaine précédente"
        >
          <IconChevronLeft class="w-5 h-5" />
        </button>
        <div class="text-center">
          <p class="font-semibold text-secondary-600">
            {{ formatWeekRange(currentWeekStart) }}
          </p>
          <button
            @click="goToCurrentWeek"
            class="text-xs text-gray-600 hover:text-secondary-600 transition mt-1"
          >
            Semaine actuelle
          </button>
        </div>
        <button
          @click="nextWeek"
          class="px-3 py-2 text-secondary-600 hover:bg-gray-100 rounded transition"
          aria-label="Semaine suivante"
        >
          <IconChevronRight class="w-5 h-5" />
        </button>
      </div>

      <!-- Pack Filter Tags -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <button
          v-for="pack in packs"
          :key="pack.id"
          @click="togglePack(pack.id)"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition"
          :class="
            selectedPacks.has(pack.id)
              ? 'bg-secondary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
        >
          {{ pack.label }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pb-4">
        <div class="space-y-4">
          <!-- Day Card -->
          <div
            v-for="day in filteredPlanningDays"
            :key="day.date"
            class="border bg-white border-gray-300 rounded-lg shadow-sm"
          >
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-secondary-600">
                {{ formatDateLong(day.date) }}
              </h3>
            </div>

            <div class="p-4 space-y-3">
              <!-- Pack Slot -->
              <div
                v-for="slot in day.slots"
                :key="slot.packId"
                class="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-secondary-600">{{ slot.packLabel }}</span>
                </div>

                <div class="flex flex-wrap gap-2">
                  <!-- Pending Wishes Count (Orange) -->
                  <div
                    v-if="slot.pendingWishesCount > 0"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-100 text-orange-800 rounded text-sm"
                  >
                    <IconClock class="w-4 h-4" />
                    <span class="font-medium">{{ slot.pendingWishesCount }}</span>
                    <span>{{ slot.pendingWishesCount > 1 ? 'demandes' : 'demande' }}</span>
                  </div>

                  <!-- Reservation (Red) -->
                  <div
                    v-if="slot.reservation"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-100 text-red-800 rounded text-sm"
                  >
                    <IconUser class="w-4 h-4" />
                    <span class="font-medium">{{ slot.reservation.userName }}</span>
                  </div>

                  <!-- Available Slot (Green) -->
                  <div
                    v-if="!slot.reservation && slot.pendingWishesCount === 0"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-100 text-green-800 rounded text-sm"
                  >
                    <IconCheck class="w-4 h-4" />
                    <span class="font-medium">Disponible</span>
                  </div>
                </div>

                <!-- Reservation Comment -->
                <div
                  v-if="slot.reservation?.comment"
                  class="mt-2 text-sm text-gray-700 italic border-t border-gray-200 pt-2"
                >
                  "{{ slot.reservation.comment }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  middleware: 'auth',
});

interface Reservation {
  userName: string;
  comment?: string;
}

interface PackSlot {
  packId: string;
  packLabel: string;
  pendingWishesCount: number;
  reservation: Reservation | null;
}

interface PlanningDay {
  date: string;
  slots: PackSlot[];
}

interface Pack {
  id: string;
  label: string;
}

// Mock data for packs
const packs = ref<Pack[]>([
  { id: 'pack-1', label: 'Takoo 5' },
  { id: 'pack-2', label: 'Yeti' },
  { id: 'pack-3', label: 'Sora' },
  { id: 'pack-4', label: 'BiUFO' },
]);

// Selected packs filter
const selectedPacks = ref<Set<string>>(new Set(packs.value.map((p) => p.id)));

// Week management
const currentWeekStart = ref<Date>(getMonday(new Date()));

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(d.setDate(diff));
}

function getWeekDays(monday: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push(day);
  }
  return days;
}

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

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mondayStr = monday.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
  const sundayStr = sunday.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return `${mondayStr} - ${sundayStr}`;
}

function formatDateToString(date: Date): string {
  const result = date.toISOString().split('T')[0];
  return result || '';
}

// Mock planning data
const planningDays = ref<PlanningDay[]>([
  {
    date: '2025-11-28',
    slots: [
      {
        packId: 'pack-1',
        packLabel: 'Takoo 5',
        pendingWishesCount: 3,
        reservation: null,
      },
      {
        packId: 'pack-2',
        packLabel: 'Yeti',
        pendingWishesCount: 0,
        reservation: {
          userName: 'Jean Dupont',
          comment: 'Préférence pour un vol matinal',
        },
      },
      {
        packId: 'pack-3',
        packLabel: 'Sora',
        pendingWishesCount: 0,
        reservation: null,
      },
      {
        packId: 'pack-4',
        packLabel: 'BiUFO',
        pendingWishesCount: 2,
        reservation: null,
      },
    ],
  },
  {
    date: '2025-11-29',
    slots: [
      {
        packId: 'pack-1',
        packLabel: 'Takoo 5',
        pendingWishesCount: 0,
        reservation: {
          userName: 'Marie Martin',
        },
      },
      {
        packId: 'pack-2',
        packLabel: 'Yeti',
        pendingWishesCount: 5,
        reservation: null,
      },
      {
        packId: 'pack-3',
        packLabel: 'Sora',
        pendingWishesCount: 0,
        reservation: null,
      },
      {
        packId: 'pack-4',
        packLabel: 'BiUFO',
        pendingWishesCount: 0,
        reservation: {
          userName: 'Paul Bernard',
          comment: 'Vol thermique souhaité si conditions favorables',
        },
      },
    ],
  },
  {
    date: '2025-11-30',
    slots: [
      {
        packId: 'pack-1',
        packLabel: 'Takoo 5',
        pendingWishesCount: 0,
        reservation: null,
      },
      {
        packId: 'pack-2',
        packLabel: 'Yeti',
        pendingWishesCount: 1,
        reservation: null,
      },
      {
        packId: 'pack-3',
        packLabel: 'Sora',
        pendingWishesCount: 0,
        reservation: {
          userName: 'Sophie Laurent',
          comment: 'Premier vol, un peu stressée',
        },
      },
      {
        packId: 'pack-4',
        packLabel: 'BiUFO',
        pendingWishesCount: 0,
        reservation: null,
      },
    ],
  },
  {
    date: '2025-12-01',
    slots: [
      {
        packId: 'pack-1',
        packLabel: 'Takoo 5',
        pendingWishesCount: 4,
        reservation: null,
      },
      {
        packId: 'pack-2',
        packLabel: 'Yeti',
        pendingWishesCount: 0,
        reservation: null,
      },
      {
        packId: 'pack-3',
        packLabel: 'Sora',
        pendingWishesCount: 0,
        reservation: {
          userName: 'Luc Moreau',
        },
      },
      {
        packId: 'pack-4',
        packLabel: 'BiUFO',
        pendingWishesCount: 2,
        reservation: null,
      },
    ],
  },
  {
    date: '2025-12-02',
    slots: [
      {
        packId: 'pack-1',
        packLabel: 'Takoo 5',
        pendingWishesCount: 0,
        reservation: {
          userName: 'Claire Dubois',
          comment: "Cadeau d'anniversaire",
        },
      },
      {
        packId: 'pack-2',
        packLabel: 'Yeti',
        pendingWishesCount: 6,
        reservation: null,
      },
      {
        packId: 'pack-3',
        packLabel: 'Sora',
        pendingWishesCount: 0,
        reservation: null,
      },
      {
        packId: 'pack-4',
        packLabel: 'BiUFO',
        pendingWishesCount: 0,
        reservation: {
          userName: 'Thomas Petit',
        },
      },
    ],
  },
]);

const filteredPlanningDays = computed(() => {
  const weekDays = getWeekDays(currentWeekStart.value);

  return weekDays.map((date) => {
    const dateString = formatDateToString(date);
    const existingDay = planningDays.value.find((d) => d.date === dateString);

    // Get all selected packs and create slots for them
    const slots: PackSlot[] = Array.from(selectedPacks.value).map((packId) => {
      const pack = packs.value.find((p) => p.id === packId);
      const existingSlot = existingDay?.slots.find((s) => s.packId === packId);

      if (existingSlot) {
        return existingSlot;
      }

      // Create a default available slot if no data exists
      return {
        packId,
        packLabel: pack?.label || packId,
        pendingWishesCount: 0,
        reservation: null,
      };
    });

    return {
      date: dateString,
      slots,
    };
  });
});

const togglePack = (packId: string) => {
  const set = selectedPacks.value;
  set.has(packId) ? set.delete(packId) : set.add(packId);
};

const formatDateLong = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
</script>
