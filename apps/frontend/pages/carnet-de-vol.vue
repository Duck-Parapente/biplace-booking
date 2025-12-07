<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <div v-if="loading" class="text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto">
        <div class="rounded-lg shadow-sm">
          <div v-if="closedReservations.length === 0" class="text-gray-500 text-sm">
            <p>Aucun vol enregistré pour le moment.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="reservation in closedReservations"
              :key="reservation.id"
              class="border bg-white border-gray-300 rounded-lg p-4 hover:shadow-md transition"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="font-bold text-secondary-600">
                    {{ formatDateLong(reservation.startingDate).day }}
                    {{ formatDateLong(reservation.startingDate).month }}
                    {{ formatDateLong(reservation.startingDate).year }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatDateLong(reservation.startingDate).weekday }}
                  </p>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                  Clôturé
                </span>
              </div>

              <div class="space-y-2 text-sm text-gray-700">
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Pack:</span>
                  <BaseTag variant="secondary">{{ getPackLabel(reservation.packId) }}</BaseTag>
                </div>

                <div v-if="reservation.flightTimeMinutes" class="flex items-center gap-2">
                  <span class="font-semibold">Temps de vol:</span>
                  <span>{{ reservation.flightTimeMinutes }} minutes</span>
                </div>

                <div v-if="reservation.flightCount" class="flex items-center gap-2">
                  <span class="font-semibold">Nombre de vols:</span>
                  <span>{{ reservation.flightCount }}</span>
                </div>

                <div v-if="reservation.publicComment" class="pt-2 border-t border-gray-200">
                  <p class="font-semibold mb-1">Commentaire:</p>
                  <p class="italic text-gray-600">"{{ reservation.publicComment }}"</p>
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
import { ReservationWishStatusDto } from 'shared';

import { formatDateLong } from '~/composables/useDateHelpers';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Carnet de vol',
});

const { reservationWishes, loading, error, getReservationWishes } = useReservationWish();
const { packs, getPacks } = usePack();

const closedReservations = computed(() => {
  return reservationWishes.value
    .filter((wish) => {
      const latestStatus = [...wish.events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0]?.status;
      return latestStatus === ReservationWishStatusDto.CLOSED && wish.reservation;
    })
    .map((wish) => ({
      id: wish.reservation!.id,
      startingDate: wish.startingDate,
      packId: wish.reservation!.packId,
      flightTimeMinutes: wish.reservation!.flightTimeMinutes,
      flightCount: wish.reservation!.flightCount,
      publicComment: wish.reservation!.publicComment,
    }))
    .sort((a, b) => new Date(b.startingDate).getTime() - new Date(a.startingDate).getTime());
});

const getPackLabel = (packId: string): string => {
  const pack = packs.value.find(({ id }) => id === packId);
  return pack ? pack.label : packId;
};

onMounted(() => {
  getReservationWishes();
  getPacks();
});
</script>
