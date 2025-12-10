<template>
  <button
    v-if="canClose"
    @click="showModal = true"
    class="w-full bg-yellow-50 hover:bg-yellow-100 border-t border-yellow-100 p-3 text-sm font-medium text-yellow-800 transition flex items-center justify-center gap-2"
  >
    <IconCheck class="w-4 h-4" />
    Clôturer la réservation
  </button>

  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Clôturer la réservation</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="flightTimeMinutes"
          v-model.number="form.flightTimeMinutes"
          label="Temps de vol (minutes)"
          type="number"
          required
          placeholder="Ex: 30"
        />

        <BaseInput
          id="flightsCount"
          v-model.number="form.flightsCount"
          label="Nombre de vols"
          type="number"
          required
          placeholder="Ex: 1"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Vérifications <span class="text-red-500">*</span>
          </label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="checklist.cleanHarness"
                type="checkbox"
                class="w-4 h-4 text-secondary-600 border-gray-300 rounded focus:ring-secondary-600"
              />
              <span class="text-sm text-gray-700">Sellette propre</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="checklist.dryWing"
                type="checkbox"
                class="w-4 h-4 text-secondary-600 border-gray-300 rounded focus:ring-secondary-600"
              />
              <span class="text-sm text-gray-700">Voile sèche</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="checklist.okHelmet"
                type="checkbox"
                class="w-4 h-4 text-secondary-600 border-gray-300 rounded focus:ring-secondary-600"
              />
              <span class="text-sm text-gray-700">Casque OK</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Observations </label>
          <textarea
            v-model="form.publicComment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            rows="3"
            placeholder="Commentaire visible par tout le monde"
          ></textarea>
        </div>

        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.shouldWarnPackOwner"
              type="checkbox"
              class="w-4 h-4 text-secondary-600 border-gray-300 rounded focus:ring-secondary-600"
            />
            <span class="text-sm font-medium text-gray-700"> Prévenir le responsable du pack </span>
          </label>
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
            :disabled="submitting || submitSuccess || !isChecklistComplete"
            class="flex-1 bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {{ submitting ? 'Clôture...' : 'Clôturer' }}
          </button>
          <button
            type="button"
            @click="closeModal"
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
import type { ReservationWishDto } from 'shared';

interface Props {
  wish: ReservationWishDto;
}

const props = defineProps<Props>();
const showModal = ref(false);

const checklist = ref({
  cleanHarness: false,
  dryWing: false,
  okHelmet: false,
});

const isChecklistComplete = computed(() => {
  return checklist.value.cleanHarness && checklist.value.dryWing && checklist.value.okHelmet;
});

const canClose = computed(() => {
  const isBeforeNow = new Date(props.wish.startingDate) < new Date();
  return isBeforeNow && !!props.wish.reservation?.isClosable;
});
const form = ref<CloseReservationDto>({
  flightTimeMinutes: 0,
  flightsCount: 0,
  publicComment: '',
  shouldWarnPackOwner: false,
});

// Composables
const { closeReservation, closing, closeError, closeSuccess } = useReservation();

// Renamed for consistency with component's responsibility
const submitting = closing;
const submitError = closeError;
const submitSuccess = closeSuccess;

// Close modal helper
const closeModal = () => {
  showModal.value = false;
};

// Form submission
const handleSubmit = async () => {
  if (!props.wish.reservation) return;

  try {
    await closeReservation(props.wish.reservation.id, form.value);

    setTimeout(() => {
      closeModal();
    }, 1000);
  } catch {}
};

// Reset form when modal opens
const resetForm = () => {
  form.value = {
    flightTimeMinutes: 0,
    flightsCount: 0,
    publicComment: '',
    shouldWarnPackOwner: false,
  };
  checklist.value = {
    cleanHarness: false,
    dryWing: false,
    okHelmet: false,
  };
};

// Watch for modal open/close
watch(
  () => showModal.value,
  async (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  },
);
</script>
