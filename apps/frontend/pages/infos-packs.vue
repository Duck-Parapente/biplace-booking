<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-3 max-w-4xl mx-auto w-full flex flex-col min-h-0">
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

      <!-- Pack Info -->
      <div
        v-if="selectedPackId && !loading && !error && packData"
        class="relative mb-6 bg-blue-50 border border-blue-300 p-3 rounded-lg shadow-md space-y-2 cursor-pointer"
        @click="showMoreInfo = !showMoreInfo"
      >
        <!-- Toggle icon (top right) -->
        <span class="absolute top-2 right-2 text-lg leading-none text-blue-600">
          {{ showMoreInfo ? '➖' : '➕' }}
        </span>

        <!-- Always displayed -->
        <div class="flex items-center gap-2 text-gray-800">
          <span class="text-sm text-gray-500">Respo:</span>
          <span>{{ packData.ownerFullName }}</span>
        </div>

        <div class="flex items-center gap-2 text-gray-800">
          <span class="text-sm text-gray-500">Contrôle:</span>
          <template v-if="packData.lastControlDate">
            <span>{{ formatDate(packData.lastControlDate) }}</span>
            <span
              v-if="packData.flightsMinutesSinceLastControlDate != null"
              class="text-sm text-gray-400"
            >
              ({{ Math.round(packData.flightsMinutesSinceLastControlDate / 60) }}h depuis le 1er
              mars)
            </span>
          </template>
          <span v-else class="text-sm text-gray-400">Non renseigné</span>
        </div>

        <div class="flex items-center gap-2 text-gray-800">
          <span class="text-sm text-gray-500">Pliage secours:</span>
          <span v-if="packData.lastRescueFoldingDate">{{
            formatDate(packData.lastRescueFoldingDate)
          }}</span>
          <span v-else class="text-sm text-gray-400">Non renseigné</span>
        </div>

        <!-- Expanded info -->
        <div v-if="showMoreInfo" class="pt-2 border-t border-blue-200 space-y-2">
          <div v-if="packData.description" class="flex items-baseline gap-2 text-gray-800">
            <span class="text-sm text-gray-500">Description:</span>
            <span>{{ packData.description }}</span>
          </div>

          <div v-if="packData.details" class="text-gray-800">
            <span class="text-sm text-gray-500">Détails:</span>
            <div class="whitespace-pre-line mt-1" v-html="packData.details"></div>
          </div>

          <div class="border-t border-blue-200 pt-2 flex justify-center gap-8 text-gray-800">
            <div class="flex items-center gap-2">
              <span>✈️</span>
              <span>{{ packData.totalFlightsCount }} vols</span>
            </div>
            <div class="flex items-center gap-2">
              <span>⏱️</span>
              <span>{{ Math.round((packData.totalFlightsMinutes ?? 0) / 60) }}h</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-3 rounded-lg">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else-if="!selectedPackId" class="text-gray-500 text-center p-8">
        <p>Veuillez sélectionner un pack pour voir le carnet de vol.</p>
      </div>

      <div v-else class="flex-1 flex flex-col min-h-0">
        <!-- Carnet de vol title with toggles -->
        <div class="mb-3 flex items-center justify-between gap-3">
          <h2 class="text-xl font-semibold text-gray-800 shrink-0">Carnet de vol</h2>
          <div class="flex items-center gap-4">
            <!-- Show confirmed toggle (always visible) -->
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <span class="text-gray-600">Confirmés</span>
              <button
                type="button"
                :class="[
                  showConfirmed ? 'bg-primary-400' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
                ]"
                role="switch"
                :aria-checked="showConfirmed"
                @click="showConfirmed = !showConfirmed"
              >
                <span
                  :class="[
                    showConfirmed ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  ]"
                />
              </button>
            </label>

            <!-- Edit mode toggle (admin only) -->
            <label v-if="isAdmin" class="flex items-center gap-2 text-sm cursor-pointer">
              <span>Édition</span>
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
            <div v-if="timeline.length === 0" class="text-gray-500 text-sm bg-white p-3 rounded-lg">
              <p>Aucun vol enregistré pour ce pack.</p>
            </div>

            <div v-else class="space-y-2">
              <template v-for="item in timeline" :key="item.id">
                <!-- Pack note -->
                <div
                  v-if="item.type === 'note'"
                  class="border border-amber-200 bg-amber-50 rounded-lg px-3 py-2 flex flex-col gap-1"
                >
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-xs text-gray-400">{{ formatDate(item.data.createdAt) }}</p>
                  </div>
                  <p class="text-sm text-gray-700 whitespace-pre-line">{{ item.data.content }}</p>
                  <p v-if="item.data.createdByName" class="text-xs text-amber-700 text-right">— {{ item.data.createdByName }}</p>
                </div>

                <!-- Reservation -->
                <div
                  v-else
                  class="border bg-white border-gray-300 rounded-lg p-3 hover:shadow-md transition"
                  :class="{ 'cursor-pointer hover:bg-gray-50': editMode }"
                  @click="handleReservationClick(item.data)"
                >
                  <div class="flex justify-between items-start mb-2">
                    <p class="text-xs text-gray-400">{{ formatDate(item.data.startingDate) }}</p>
                    <div class="flex flex-col items-end gap-1.5">
                      <BaseTag
                        v-if="item.data.status === ReservationWishStatusDto.CANCELLED"
                        variant="danger"
                      >
                        Annulé
                      </BaseTag>
                      <BaseTag
                        v-else-if="item.data.status === ReservationWishStatusDto.CLOSED"
                        variant="success"
                      >
                        Clôturé
                      </BaseTag>
                      <BaseTag
                        v-else-if="item.data.status === ReservationWishStatusDto.CONFIRMED"
                        variant="gray"
                      >
                        Confirmé
                      </BaseTag>
                    </div>
                  </div>

                  <div v-if="item.data.userName" class="mb-2 text-sm flex items-center gap-2">
                    <span class="font-semibold">Pilote:</span>
                    <PilotDisplay :display-name="item.data.userName" />
                    <template v-if="editMode">
                      <span class="font-semibold text-xl text-gray-200">&nbsp;/&nbsp;</span>
                      <CostDisplay :cost="item.data.manualCost ?? item.data.automaticCost ?? 0" />
                    </template>
                  </div>

                  <div
                    v-if="item.data.flightLog"
                    class="bg-gray-100 rounded-lg p-2 space-y-1.5 text-sm"
                  >
                    <div class="flex items-center gap-2">
                      <span class="font-semibold">Temps de vol:</span>
                      <span>{{ item.data.flightLog.flightTimeMinutes }} minutes</span>
                    </div>

                    <div class="flex items-center gap-2">
                      <span class="font-semibold">Nombre de vols:</span>
                      <span>{{ item.data.flightLog.flightsCount }}</span>
                    </div>

                    <div
                      v-if="item.data.flightLog.publicComment"
                      class="pt-1.5 border-t border-gray-200"
                    >
                      <p class="font-semibold mb-1">Commentaire:</p>
                      <p class="italic text-gray-600">"{{ item.data.flightLog.publicComment }}"</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed button to add a note (admin/manager only) -->
    <button
      v-if="selectedPackId && isAdminOrManager"
      type="button"
      class="fixed bottom-4 right-4 w-12 h-12 bg-amber-400 hover:bg-amber-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition z-40"
      title="Ajouter une note"
      @click="noteModalOpen = true"
    >
      ✏️
    </button>

    <EditCostModal
      v-if="editingReservation"
      :open="editModalOpen"
      :reservation-id="editingReservation.id"
      :automatic-cost="editingReservation.automaticCost"
      :current-manual-cost="editingReservation.manualCost"
      @close="closeEditModal"
      @updated="handleCostUpdated"
    />

    <CreatePackNoteModal
      v-if="selectedPackId"
      :open="noteModalOpen"
      :pack-id="selectedPackId"
      @close="noteModalOpen = false"
      @created="handleNoteCreated"
    />
  </main>
</template>

<script setup lang="ts">
import { ReservationWishStatusDto, type PackReservationsDto, type PackNoteDto } from 'shared';

import type { AutocompleteOption } from '~/components/atoms/BaseAutocomplete.vue';
import { formatDate } from '~/composables/useDateHelpers';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Infos packs',
});

type ReservationItem = PackReservationsDto['reservations'][0];

type TimelineItem =
  | { id: string; type: 'reservation'; sortDate: number; data: ReservationItem }
  | { id: string; type: 'note'; sortDate: number; data: PackNoteDto };

const { callApi } = useApi();
const { packs, getPacks, getPackNotes } = usePack();
const { isAdmin, isAdminOrManager } = useAuth();

const { value: selectedPackId } = useLocalStorage<string | null>('selectedPackId', null);
const packData = ref<PackReservationsDto | null>(null);
const packNotes = ref<PackNoteDto[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const editMode = ref<boolean>(false);
const showConfirmed = ref<boolean>(false);
const showMoreInfo = ref<boolean>(false);
const editModalOpen = ref<boolean>(false);
const noteModalOpen = ref<boolean>(false);
const editingReservation = ref<ReservationItem | null>(null);

const packOptions = computed<AutocompleteOption[]>(() => {
  return packs.value
    .sort((a, b) => a.order - b.order)
    .map((pack) => ({
      value: pack.id,
      label: pack.label,
    }));
});

const timeline = computed<TimelineItem[]>(() => {
  const reservationItems: TimelineItem[] = (packData.value?.reservations ?? [])
    .filter((reservation) => {
      if (!editMode.value && reservation.status === ReservationWishStatusDto.CANCELLED)
        return false;
      if (!showConfirmed.value && reservation.status === ReservationWishStatusDto.CONFIRMED)
        return false;
      return true;
    })
    .map((r) => ({
      id: r.id,
      type: 'reservation' as const,
      sortDate: new Date(r.startingDate).getTime(),
      data: r,
    }));

  const noteItems: TimelineItem[] = packNotes.value.map((n) => ({
    id: n.id,
    type: 'note' as const,
    sortDate: new Date(n.createdAt).getTime(),
    data: n,
  }));

  return [...reservationItems, ...noteItems].sort((a, b) => b.sortDate - a.sortDate);
});

const handlePackSelect = async (packId: string | null) => {
  if (!packId) {
    packData.value = null;
    packNotes.value = [];
    return;
  }
  await Promise.all([fetchPackReservations(packId), fetchPackNotes(packId)]);
};

const fetchPackReservations = async (packId: string) => {
  try {
    loading.value = true;
    error.value = null;
    packData.value = await callApi<PackReservationsDto>(`/reservations/pack?packId=${packId}`);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Impossible de charger les réservations du pack';
    error.value = errorMessage;
    console.error('Failed to fetch pack reservations:', err);
  } finally {
    loading.value = false;
  }
};

const fetchPackNotes = async (packId: string) => {
  try {
    packNotes.value = await getPackNotes(packId);
  } catch (err) {
    console.error('Failed to fetch pack notes:', err);
  }
};

const handleReservationClick = (reservation: ReservationItem) => {
  if (editMode.value) {
    openEditModal(reservation);
  }
};

const openEditModal = (reservation: ReservationItem) => {
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

const handleNoteCreated = async () => {
  if (selectedPackId.value) {
    await fetchPackNotes(selectedPackId.value);
  }
};

onMounted(async () => {
  await getPacks();

  if (selectedPackId.value) {
    await Promise.all([
      fetchPackReservations(selectedPackId.value),
      fetchPackNotes(selectedPackId.value),
    ]);
  }
});
</script>
