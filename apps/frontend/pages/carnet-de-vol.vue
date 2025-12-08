<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <!-- Pack Selection -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <BaseAutocomplete
          id="pack-select"
          v-model="selectedPackLabel"
          :options="packOptions"
          label="Sélectionner un pack"
          placeholder="Rechercher un pack..."
          @select="handlePackSelect"
        />
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

          <div v-else class="space-y-3">
            <div
              v-for="reservation in reservations"
              :key="reservation.id"
              class="border bg-white border-gray-300 rounded-lg p-4 hover:shadow-md transition"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="font-bold text-secondary-600">
                    {{ formatDateLong(reservation.startingDate).day }}
                    {{ formatDateLong(reservation.startingDate).month }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatDateLong(reservation.startingDate).weekday }}
                  </p>
                </div>
                <BaseTag v-if="reservation.flightLog" variant="success"> Clôturé </BaseTag>
              </div>

              <div v-if="reservation.flightLog" class="space-y-2 text-sm text-gray-700">
                <div v-if="reservation.userName" class="flex items-center gap-2">
                  <span class="font-semibold">Pilote:</span>
                  <span>{{ reservation.userName }}</span>
                </div>

                <div class="space-y-2 pt-2 border-t border-gray-200">
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
                    class="pt-2 border-t border-gray-200"
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
    </div>
  </main>
</template>

<script setup lang="ts">
import type { AutocompleteOption } from '~/components/atoms/BaseAutocomplete.vue';
import { formatDateLong } from '~/composables/useDateHelpers';

interface FlightLogDto {
  flightTimeMinutes: number;
  flightsCount: number;
  publicComment?: string | null;
}

interface FlightBookPackReservationDto {
  id: string;
  startingDate: string;
  endingDate: string;
  userName: string | null;
  flightLog: FlightLogDto | null;
}

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Carnet de vol',
});

const { callApi } = useApi();
const { packs, getPacks } = usePack();

const selectedPackId = ref<string | null>(null);
const selectedPackLabel = ref<string>('');
const reservations = ref<FlightBookPackReservationDto[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const packOptions = computed<AutocompleteOption[]>(() => {
  return packs.value.map((pack) => ({
    value: pack.id,
    label: pack.label,
  }));
});

const handlePackSelect = async (packId: string) => {
  if (!packId) return;

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
    const data = await callApi<FlightBookPackReservationDto[]>(`/packs/${packId}/reservations`);
    reservations.value = data.sort(
      (a, b) => new Date(b.startingDate).getTime() - new Date(a.startingDate).getTime(),
    );
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
