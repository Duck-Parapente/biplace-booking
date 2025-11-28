<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Nouvelle demande de réservation</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="startingDate"
          v-model="localForm.startingDate"
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
            v-model="localForm.publicComment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            rows="3"
            placeholder="Ajoutez un commentaire..."
          ></textarea>
        </div>

        <div v-if="error" class="p-3 bg-red-50 text-red-700 text-sm">
          <p><strong>Erreur:</strong> {{ error }}</p>
        </div>

        <div v-if="success" class="p-3 bg-primary-400/20 text-secondary-600 text-sm">
          <p>✓ Demande créée avec succès</p>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="submitting || selectedPacks.length === 0 || !localForm.startingDate"
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
import type { CreateReservationWishDto, PackDto } from 'shared';

import { formatDateToString } from '~/composables/useDateHelpers';

interface Props {
  show: boolean;
  packs: PackDto[];
  submitting: boolean;
  error: string | null;
  success: boolean;
  modelValue: CreateReservationWishDto;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [];
  'update:modelValue': [value: CreateReservationWishDto];
}>();

const localForm = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const packSearch = ref('');
const selectedPacks = ref<PackDto[]>([]);

const today = computed(() => formatDateToString(new Date()));

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
    localForm.value.packChoices = selectedPacks.value.map((p) => p.id);
  }
  packSearch.value = '';
};

const removePackChoice = (packId: string) => {
  selectedPacks.value = selectedPacks.value.filter((p) => p.id !== packId);
  localForm.value.packChoices = selectedPacks.value.map((p) => p.id);
};

const handleSubmit = () => {
  emit('submit');
};

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      selectedPacks.value = [];
      packSearch.value = '';
    }
  },
);
</script>
