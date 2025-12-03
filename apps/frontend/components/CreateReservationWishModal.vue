<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
    <div class="max-w-4xl mx-auto">
      <button
        @click="openCreateModal"
        class="w-full bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-3 rounded font-medium"
      >
        Créer une nouvelle demande
      </button>
    </div>
  </div>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Nouvelle demande de réservation</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="startingDate"
          v-model="addReservationWishForm.startingDate"
          label="Date"
          type="date"
          required
          :min="today"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Packs souhaités (par ordre de préférence)
            <span class="text-red-500">*</span>
          </label>
          <div class="space-y-2">
            <BaseAutocomplete
              id="packSearch"
              ref="packSearchRef"
              v-model="packSearch"
              :options="packOptions"
              placeholder="Rechercher un pack..."
              no-results-text="Aucun pack trouvé"
              @select="handlePackSelect"
            />
            <div v-if="selectedPacks.length > 0" class="flex flex-wrap gap-2">
              <div
                v-for="(pack, index) in selectedPacks"
                :key="pack.id"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
              >
                <span class="font-semibold">{{ index + 1 }}.</span>
                {{ pack.label }}
                <button
                  type="button"
                  @click="removePackChoice(pack.id)"
                  class="hover:text-secondary-900"
                >
                  <IconXCircle class="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Commentaire public (optionnel)
          </label>
          <textarea
            v-model="addReservationWishForm.publicComment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            rows="3"
            placeholder="Ajoutez un commentaire..."
          ></textarea>
        </div>

        <div v-if="submitError" class="p-3 bg-red-50 text-red-700 text-sm">
          <p><strong>Erreur:</strong> {{ submitError }}</p>
        </div>

        <div v-if="submitSuccess" class="p-3 bg-primary-400/20 text-secondary-600 text-sm">
          <p>✓ Demande créée avec succès</p>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="
              submitting || selectedPacks.length === 0 || !addReservationWishForm.startingDate
            "
            class="flex-1 bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {{ submitting ? 'Création...' : 'Créer' }}
          </button>
          <button
            type="button"
            @click="$emit('close')"
            :disabled="submitting"
            class="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PackDto } from 'shared';

import { formatDateToString } from '~/composables/useDateHelpers';

interface Props {
  packs: PackDto[];
}

const { addReservationWishForm, submitReservationWish, submitError, submitSuccess, submitting } =
  useReservationWish();

const props = defineProps<Props>();
const packSearch = ref('');
const showModal = ref(false);
const selectedPacks = ref<PackDto[]>([]);

const today = computed(() => formatDateToString(new Date()));

const openCreateModal = () => {
  showModal.value = true;
  submitError.value = null;
  submitSuccess.value = false;
  selectedPacks.value = [];
  packSearch.value = '';
  addReservationWishForm.value = {
    startingDate: '',
    packChoices: [],
    publicComment: undefined,
  };
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  await submitReservationWish();

  if (submitSuccess.value) {
    setTimeout(() => {
      closeModal();
    }, 1000);
  }
};

const packOptions = computed(() =>
  props.packs
    .filter((pack) => !selectedPacks.value.find((p) => p.id === pack.id))
    .map((pack) => ({
      value: pack.id,
      label: pack.label,
    })),
);

const handlePackSelect = (packId: string) => {
  const pack = props.packs.find((p) => p.id === packId);
  if (pack && !selectedPacks.value.find((p) => p.id === pack.id)) {
    selectedPacks.value.push(pack);
    addReservationWishForm.value.packChoices = selectedPacks.value.map((p) => p.id);
  }
  packSearch.value = '';
};

const removePackChoice = (packId: string) => {
  selectedPacks.value = selectedPacks.value.filter((p) => p.id !== packId);
  addReservationWishForm.value.packChoices = selectedPacks.value.map((p) => p.id);
};
</script>
