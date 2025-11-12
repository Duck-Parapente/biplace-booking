<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <h2 class="text-2xl font-semibold mb-4 text-secondary-600">Gestion des Packs</h2>

      <div v-if="loading" class="p-4 text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 text-red-700">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="mb-6">
            <button
              @click="openCreatePackModal"
              class="bg-secondary-600 text-primary-400 hover:bg-secondary-700 transition text-sm px-4 py-2 rounded"
            >
              Ajouter un pack
            </button>
          </div>

          <!-- Future: Pack list will be displayed here -->
          <div class="text-gray-500 text-sm">
            <p>La liste des packs sera affichée ici.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Pack Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeCreatePackModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-secondary-600">Ajouter un pack</h3>

        <form @submit.prevent="createPack" class="space-y-4">
          <div>
            <label for="label" class="block text-sm font-medium text-secondary-600 mb-1">
              Label <span class="text-red-500">*</span>
            </label>
            <input
              id="label"
              v-model="packForm.label"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-600"
            />
          </div>

          <div>
            <label for="ownerId" class="block text-sm font-medium text-secondary-600 mb-1">
              ID du propriétaire <span class="text-red-500">*</span>
            </label>
            <input
              id="ownerId"
              v-model="packForm.ownerId"
              type="text"
              required
              placeholder="UUID du propriétaire"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-600"
            />
          </div>

          <div>
            <label for="flightsHours" class="block text-sm font-medium text-secondary-600 mb-1">
              Heures de vol
            </label>
            <input
              id="flightsHours"
              v-model.number="packForm.flightsHours"
              type="number"
              min="0"
              step="0.5"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-600"
            />
          </div>

          <div>
            <label for="flightsCount" class="block text-sm font-medium text-secondary-600 mb-1">
              Nombre de vols
            </label>
            <input
              id="flightsCount"
              v-model.number="packForm.flightsCount"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-600"
            />
          </div>

          <div v-if="createError" class="p-3 bg-red-50 text-red-700 text-sm">
            <p><strong>Erreur:</strong> {{ createError }}</p>
          </div>

          <div v-if="createSuccess" class="p-3 bg-primary-400/20 text-secondary-600 text-sm">
            <p>✓ Pack créé avec succès</p>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 bg-secondary-600 text-primary-400 hover:bg-secondary-700 transition text-sm px-4 py-2 rounded disabled:opacity-50"
            >
              {{ creating ? 'Création...' : 'Créer' }}
            </button>
            <button
              type="button"
              @click="closeCreatePackModal"
              class="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm px-4 py-2 rounded"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { CreatePackDto } from 'shared';

definePageMeta({
  middleware: 'admin',
});

const { callApi } = useApi();

const loading = ref(false);
const error = ref<string | null>(null);
const showCreateModal = ref(false);
const creating = ref(false);
const createError = ref<string | null>(null);
const createSuccess = ref(false);

const packForm = ref<CreatePackDto>({
  label: '',
  ownerId: '',
  flightsHours: undefined,
  flightsCount: undefined,
});

const openCreatePackModal = () => {
  showCreateModal.value = true;
  createError.value = null;
  createSuccess.value = false;
  // Reset form
  packForm.value = {
    label: '',
    ownerId: '',
    flightsHours: undefined,
    flightsCount: undefined,
  };
};

const closeCreatePackModal = () => {
  showCreateModal.value = false;
};

const createPack = async () => {
  try {
    creating.value = true;
    createError.value = null;
    createSuccess.value = false;

    // Prepare the payload - only include optional fields if they have values
    const payload: CreatePackDto = {
      label: packForm.value.label,
      ownerId: packForm.value.ownerId,
    };

    if (packForm.value.flightsHours !== undefined && packForm.value.flightsHours !== null) {
      payload.flightsHours = packForm.value.flightsHours;
    }

    if (packForm.value.flightsCount !== undefined && packForm.value.flightsCount !== null) {
      payload.flightsCount = packForm.value.flightsCount;
    }

    await callApi('/pack/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    createSuccess.value = true;

    // Close modal after a short delay
    setTimeout(() => {
      closeCreatePackModal();
    }, 1500);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Impossible de créer le pack';
    createError.value = errorMessage;
    console.error('Failed to create pack:', err);
  } finally {
    creating.value = false;
  }
};

onMounted(() => {
  // Future: Load pack list here
  loading.value = false;
});
</script>
