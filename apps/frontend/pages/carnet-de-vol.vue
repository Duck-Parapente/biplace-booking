<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <!-- Pack Selection -->
      <div class="mb-2 bg-white p-4 rounded-lg shadow-sm">
        <BaseAutocomplete
          id="pack-select"
          v-model="selectedPackLabel"
          :options="packOptions"
          label="Sélectionner un pack"
          placeholder="Rechercher un pack..."
          @select="handlePackSelect"
        />
      </div>

      <!-- Pack Totals -->
      <div
        v-if="selectedPackId && !loading && !error"
        class="mb-6 bg-white p-2 rounded-lg shadow-sm"
      >
        <div class="flex gap-6 text-sm">
          <div>
            <span class="font-semibold">Heures de vol:</span>
            <span class="ml-2">{{ totalFlightsHours }}h</span>
          </div>
          <div>
            <span class="font-semibold">Nombre de vols:</span>
            <span class="ml-2">{{ totalFlightsCount }}</span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else-if="!selectedPackId" class="text-gray-500 text-center p-8">
        <p>Veuillez sélectionner un pack pour voir le carnet de vol.</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto">
        <div class="rounded-lg shadow-sm">
          <div
            v-if="reservations.length === 0"
            class="text-gray-500 text-sm bg-white p-4 rounded-lg"
          >
            <p>Aucun vol enregistré pour ce pack.</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="reservation in reservations"
              :key="reservation.id"
              class="border bg-white border-gray-300 rounded-lg p-3 hover:shadow-md transition"
            >
              <div class="flex justify-between items-start mb-2">
                <DateDisplay :date="reservation.startingDate" />
                <BaseTag v-if="reservation.flightLog" variant="success"> Clôturé </BaseTag>
              </div>

              <div v-if="reservation.userName" class="mb-2 text-sm">
                <span class="font-semibold">Pilote:</span>
                <span class="ml-2">{{ reservation.userName }}</span>
              </div>

              <div
                v-if="reservation.flightLog"
                class="bg-gray-100 rounded-lg p-2 space-y-1.5 text-sm"
              >
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Temps de vol:</span>
                  <span>{{ reservation.flightLog.flightTimeMinutes }} minutes</span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="font-semibold">Nombre de vols:</span>
                  <span>{{ reservation.flightLog.flightsCount }}</span>
                </div>

                <div
                  v-if="reservation.flightLog.publicComment"
                  class="pt-1.5 border-t border-gray-200"
                >
                  <p class="font-semibold mb-1">Commentaire:</p>
                  <p class="italic text-gray-600">"{{ reservation.flightLog.publicComment }}"</p>
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
import type { PackReservationsDto } from 'shared';

import type { AutocompleteOption } from '~/components/atoms/BaseAutocomplete.vue';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Carnet de vol',
});

const { callApi } = useApi();
const { packs, getPacks } = usePack();

const selectedPackId = ref<string | null>(null);
const selectedPackLabel = ref<string>('');
const reservations = ref<PackReservationsDto['reservations']>([]);
const totalFlightsHours = ref<number>(0);
const totalFlightsCount = ref<number>(0);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const packOptions = computed<AutocompleteOption[]>(() => {
  return packs.value.map((pack) => ({
    value: pack.id,
    label: pack.label,
  }));
});

const handlePackSelect = async (packId: string) => {
  if (!packId) {
    selectedPackId.value = null;
    reservations.value = [];
    return;
  }

  selectedPackId.value = packId;
  const pack = packs.value.find((p) => p.id === packId);
  if (pack) {
    selectedPackLabel.value = pack.label;
  }
  await fetchPackReservations(packId);
};

const fetchPackReservations = async (packId: string) => {
  try {
    loading.value = true;
    error.value = null;
    const data = await callApi<PackReservationsDto>(`/packs/${packId}/reservations`);
    reservations.value = data.reservations.sort(
      (a, b) => new Date(b.startingDate).getTime() - new Date(a.startingDate).getTime(),
    );
    totalFlightsHours.value = data.totalFlightsHours;
    totalFlightsCount.value = data.totalFlightsCount;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Impossible de charger les réservations du pack';
    error.value = errorMessage;
    console.error('Failed to fetch pack reservations:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getPacks();
});
</script>
