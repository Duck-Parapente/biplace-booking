<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Clôturer la réservation</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="flightTimeMinutes"
          v-model.number="form.flightTimeMinutes"
          label="Temps de vol (minutes)"
          type="number"
          min="1"
          required
          placeholder="Ex: 30"
        />

        <BaseInput
          id="flightCount"
          v-model.number="form.flightCount"
          label="Nombre de vols"
          type="number"
          min="1"
          required
          placeholder="Ex: 1"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Commentaire public </label>
          <textarea
            v-model="form.publicComment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            rows="3"
            placeholder="Commentaire visible par le passager..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Commentaire privé </label>
          <textarea
            v-model="form.privateComment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            rows="3"
            placeholder="Commentaire interne (non visible par le passager)..."
          ></textarea>
        </div>

        <div v-if="submitError" class="p-3 bg-red-50 text-red-700 text-sm">
          <p><strong>Erreur:</strong> {{ submitError }}</p>
        </div>

        <div v-if="submitSuccess" class="p-3 bg-primary-400/20 text-secondary-600 text-sm">
          <p>✓ Réservation clôturée avec succès</p>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="submitting || submitSuccess || !isFormValid"
            class="flex-1 bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {{ submitting ? 'Clôture...' : 'Clôturer' }}
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
import type { CloseReservationDto } from 'shared';

interface Props {
  show: boolean;
  reservationId: string;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const form = ref<CloseReservationDto>({
  flightTimeMinutes: 0,
  flightCount: 0,
  publicComment: '',
  privateComment: '',
});

// Composables
const { closeReservation, closing, closeError, closeSuccess } = useReservation();

// Renamed for consistency with component's responsibility
const submitting = closing;
const submitError = closeError;
const submitSuccess = closeSuccess;

// Form validation
const isFormValid = computed(() => {
  return !!(
    form.value.flightTimeMinutes &&
    form.value.flightTimeMinutes > 0 &&
    form.value.flightCount &&
    form.value.flightCount > 0
  );
});

// Form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    await closeReservation(props.reservationId, form.value);
    emit('submit');

    setTimeout(() => {
      emit('close');
    }, 1000);
  } catch {}
};

// Reset form when modal opens
const resetForm = () => {
  form.value = {
    flightTimeMinutes: 0,
    flightCount: 0,
    publicComment: '',
    privateComment: '',
  };
};

// Watch for modal open/close
watch(
  () => props.show,
  async (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  },
);
</script>
