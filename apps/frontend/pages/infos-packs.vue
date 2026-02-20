<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <!-- Pack Selection -->
      <select
        id="pack-select"
        v-model="selectedPackId"
        @change="handlePackSelect(selectedPackId)"
        class="mb-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
      >
        <option :value="null">Sélectionner un pack...</option>
        <option v-for="pack in packOptions" :key="pack.value" :value="pack.value">
          {{ pack.label }}
        </option>
      </select>

      <!-- Pack Totals -->
      <div
        v-if="selectedPackId && !loading && !error"
        class="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg shadow-md"
      >
        <div class="flex items-center gap-2 mb-2 text-gray-800">
          <span class="text-sm text-gray-600">Respo:</span>
          <span>{{ ownerFullName }}</span>
        </div>
        <div class="flex gap-8 text-gray-700">
          <div class="flex items-center gap-2">
            <span>⏱️</span>
            <span class="text-2xl">{{ Math.round(totalFlightsMinutes / 60) }}h</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✈️</span>
            <span class="text-2xl">{{ totalFlightsCount }} vols</span>
          </div>
        </div>
        <div
          v-if="selectedPackDescription"
          class="mt-3 pt-3 border-t border-blue-200 text-sm text-gray-600"
        >
          {{ selectedPackDescription }}
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

      <div v-else class="flex-1 flex flex-col min-h-0">
        <!-- Carnet de vol title with edit button -->
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800">Carnet de vol</h2>
          <div v-if="isAdmin" class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <span>Mode édition</span>
              <button
                type="button"
                :class="[
                  editMode ? 'bg-primary-400' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
                ]"
                role="switch"
                :aria-checked="editMode"
                @click="editMode = !editMode"
              >
                <span
                  :class="[
                    editMode ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  ]"
                />
              </button>
            </label>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
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
                :class="{ 'cursor-pointer hover:bg-gray-50': editMode }"
                @click="handleReservationClick(reservation)"
              >
                <div class="flex justify-between items-start mb-2">
                  <DateDisplay :date="reservation.startingDate" />
                  <div class="flex flex-col items-end gap-1.5">
                    <BaseTag
                      v-if="reservation.status === ReservationWishStatusDto.CANCELLED"
                      variant="danger"
                    >
                      Annulé
                    </BaseTag>
                    <BaseTag
                      v-else-if="reservation.status === ReservationWishStatusDto.CLOSED"
                      variant="success"
                    >
                      Clôturé
                    </BaseTag>
                    <BaseTag
                      v-else-if="reservation.status === ReservationWishStatusDto.CONFIRMED"
                      variant="gray"
                    >
                      Confirmé
                    </BaseTag>
                  </div>
                </div>

                <div v-if="reservation.userName" class="mb-2 text-sm flex items-center gap-2">
                  <span class="font-semibold">Pilote:</span>
                  <PilotDisplay :display-name="reservation.userName" />
                  <template v-if="editMode">
                    <span class="font-semibold text-xl text-gray-200">&nbsp;/&nbsp;</span>
                    <CostDisplay :cost="reservation.manualCost ?? reservation.automaticCost ?? 0" />
                  </template>
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
    </div>
    <EditCostModal
      v-if="editingReservation"
      :open="editModalOpen"
      :reservation-id="editingReservation.id"
      :automatic-cost="editingReservation.automaticCost"
      :current-manual-cost="editingReservation.manualCost"
      @close="closeEditModal"
      @updated="handleCostUpdated"
    />
  </main>
</template>

<script setup lang="ts">
import { ReservationWishStatusDto, type PackReservationsDto, UserRoles } from 'shared';

import type { AutocompleteOption } from '~/components/atoms/BaseAutocomplete.vue';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Infos packs',
});

const { callApi } = useApi();
const { packs, getPacks } = usePack();
const { hasRole } = useAuth();

const isAdmin = computed(() => hasRole(UserRoles.ADMIN));

const selectedPackId = ref<string | null>(null);
const allReservations = ref<PackReservationsDto['reservations']>([]);
const totalFlightsMinutes = ref<number>(0);
const ownerFullName = ref<string>('');
const totalFlightsCount = ref<number>(0);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const editMode = ref<boolean>(false);
const editModalOpen = ref<boolean>(false);
const editingReservation = ref<PackReservationsDto['reservations'][0] | null>(null);

const packOptions = computed<AutocompleteOption[]>(() => {
  return packs.value
    .sort((a, b) => a.order - b.order)
    .map((pack) => ({
      value: pack.id,
      label: pack.label,
    }));
});

const selectedPackDescription = computed(() => {
  if (!selectedPackId.value) return null;
  const pack = packs.value.find((p) => p.id === selectedPackId.value);
  return pack?.description || null;
});

const reservations = computed(() => {
  return allReservations.value
    .filter(
      (reservation) => editMode.value || reservation.status !== ReservationWishStatusDto.CANCELLED,
    )
    .sort((a, b) => new Date(b.startingDate).getTime() - new Date(a.startingDate).getTime());
});

const handlePackSelect = async (packId: string | null) => {
  if (!packId) {
    allReservations.value = [];
    return;
  }

  await fetchPackReservations(packId);
};

const fetchPackReservations = async (packId: string) => {
  try {
    loading.value = true;
    error.value = null;
    const data = await callApi<PackReservationsDto>(`/reservations/pack?packId=${packId}`);
    allReservations.value = data.reservations;
    totalFlightsMinutes.value = data.totalFlightsMinutes;
    ownerFullName.value = data.ownerFullName;
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

const handleReservationClick = (reservation: PackReservationsDto['reservations'][0]) => {
  if (editMode.value) {
    openEditModal(reservation);
  }
};

const openEditModal = (reservation: PackReservationsDto['reservations'][0]) => {
  editingReservation.value = reservation;
  editModalOpen.value = true;
};

const closeEditModal = () => {
  editModalOpen.value = false;
  editingReservation.value = null;
};

const handleCostUpdated = async () => {
  if (selectedPackId.value) {
    await fetchPackReservations(selectedPackId.value);
  }
};

onMounted(() => {
  getPacks();
});
</script>
