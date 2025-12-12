<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <ReservationWishFilters
        :available-statuses="availableStatuses"
        :selected-statuses="selectedStatuses"
        @toggle="toggleStatus"
      />

      <div v-if="loading" class="text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto pb-32">
        <div class="rounded-lg shadow-sm">
          <div v-if="filteredReservationWishes.length === 0" class="text-gray-500 text-sm">
            <p>Aucune demande de réservation pour le moment.</p>
          </div>

          <div v-else class="space-y-3">
            <ReservationWishCard
              v-for="wish in filteredReservationWishes"
              :key="wish.id"
              :wish="wish"
              :packs="packs"
              :current-status="getCurrentStatus(wish)"
            />
          </div>
        </div>
      </div>
    </div>
    <CreateReservationWishModal
      :packs="packs"
      :has-unclosed-old-reservation="hasUnclosedOldReservation"
    />
  </main>
</template>

<script setup lang="ts">
import { ReservationWishStatusDto, type ReservationWishDto } from 'shared';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Mes demandes',
});

const { reservationWishes, loading, error, getReservationWishes } = useReservationWish();

const { packs, getPacks } = usePack();

const selectedStatuses = ref<Set<ReservationWishStatusDto>>(
  new Set([ReservationWishStatusDto.PENDING, ReservationWishStatusDto.CONFIRMED]),
);

const getCurrentStatus = (wish: ReservationWishDto) => {
  const sortedEvents = [...wish.events]
    .filter((event) => event.status !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sortedEvents[0]?.status ?? ReservationWishStatusDto.PENDING;
};

const availableStatuses = computed(() => {
  return [...new Set(reservationWishes.value.map((wish) => getCurrentStatus(wish)))];
});

const filteredReservationWishes = computed(() => {
  return reservationWishes.value
    .sort((a, b) => {
      return new Date(b.startingDate).getTime() - new Date(a.startingDate).getTime();
    })
    .filter((wish) => selectedStatuses.value.has(getCurrentStatus(wish)));
});

const toggleStatus = (status: ReservationWishStatusDto) => {
  const set = selectedStatuses.value;
  set.has(status) ? set.delete(status) : set.add(status);
};

const hasUnclosedOldReservation = computed(() => {
  return reservationWishes.value.some((wish) => {
    const now = new Date();
    const startingDate = new Date(wish.startingDate);
    const threeDaysAfterFlight = new Date(startingDate);
    threeDaysAfterFlight.setDate(threeDaysAfterFlight.getDate() + 3);

    const isAfter3Days = now > threeDaysAfterFlight;

    return isAfter3Days && !!wish.reservation?.isClosable;
  });
});

onMounted(() => {
  getReservationWishes();
  getPacks();
});
</script>
