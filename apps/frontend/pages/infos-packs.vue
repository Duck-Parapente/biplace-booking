<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-3 max-w-4xl mx-auto w-full flex flex-col min-h-0">
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

      <PackInfoCard v-if="selectedPackId && !loading && !error && packData" :pack-data="packData" />

      <div v-if="loading" class="text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-3 rounded-lg">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else-if="!selectedPackId" class="text-gray-500 text-center p-8">
        <p>Veuillez sélectionner un pack pour voir le carnet de vol.</p>
      </div>

      <PackTimeline
        v-else
        :reservations="packData?.reservations ?? []"
        :notes="packNotes"
        :is-admin="isAdmin"
        @reservation-click="handleReservationClick"
        @note-edit="handleNoteEdit"
      />
    </div>

    <button
      v-if="selectedPackId && isAdminOrManager"
      type="button"
      class="fixed bottom-4 right-4 w-12 h-12 bg-amber-400 hover:bg-amber-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition z-40"
      title="Ajouter une note"
      @click="openNoteModal"
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

    <PackNoteModal
      v-if="selectedPackId"
      :open="noteModalOpen"
      :pack-id="selectedPackId"
      :note="editingNote"
      @close="closeNoteModal"
      @created="handleNoteCreated"
      @updated="handleNoteUpdated"
    />
  </main>
</template>

<script setup lang="ts">
import type { PackReservationsDto, PackNoteDto } from 'shared';

import type { AutocompleteOption } from '~/components/atoms/BaseAutocomplete.vue';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Infos packs',
});

type ReservationItem = PackReservationsDto['reservations'][0];

const { callApi } = useApi();
const { packs, getPacks, getPackNotes } = usePack();
const { isAdmin, isAdminOrManager } = useAuth();

const { value: selectedPackId } = useLocalStorage<string | null>('selectedPackId', null);
const packData = ref<PackReservationsDto | null>(null);
const packNotes = ref<PackNoteDto[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const editModalOpen = ref<boolean>(false);
const noteModalOpen = ref<boolean>(false);
const editingReservation = ref<ReservationItem | null>(null);
const editingNote = ref<PackNoteDto | null>(null);

const packOptions = computed<AutocompleteOption[]>(() => {
  return packs.value
    .sort((a, b) => a.order - b.order)
    .map((pack) => ({
      value: pack.id,
      label: pack.label,
    }));
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

const openNoteModal = () => {
  editingNote.value = null;
  noteModalOpen.value = true;
};

const closeNoteModal = () => {
  noteModalOpen.value = false;
  editingNote.value = null;
};

const handleNoteEdit = (note: PackNoteDto) => {
  editingNote.value = note;
  noteModalOpen.value = true;
};

const handleNoteCreated = async () => {
  if (selectedPackId.value) {
    await fetchPackNotes(selectedPackId.value);
  }
};

const handleNoteUpdated = async () => {
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
