<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Modifier la réservation</h3>
      <div class="space-y-4">
        <div>
          <label for="automatic-cost-input" class="block text-sm font-medium text-gray-700 mb-2">
            Coût calculé automatiquement
          </label>
          <input
            id="automatic-cost-input"
            :value="props.automaticCost"
            type="number"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label for="manual-cost-input" class="block text-sm font-medium text-gray-700 mb-2">
            Coût manuel (+ prioritaire)
          </label>
          <input
            id="manual-cost-input"
            v-model.number="newManualCost"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            :disabled="saving"
            class="flex-1 bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-2 rounded disabled:opacity-50"
            @click="handleConfirm"
          >
            {{ saving ? 'Enregistrement...' : 'Confirmer' }}
          </button>
          <button
            type="button"
            @click="handleClose"
            :disabled="saving"
            class="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  open: boolean;
  reservationId: string;
  currentManualCost: number | null;
  automaticCost: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const { updateReservation } = useReservation();

const newManualCost = ref(props.currentManualCost ?? 0);
const saving = ref(false);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      newManualCost.value = props.currentManualCost ?? 0;
    }
  },
);

const handleClose = () => {
  if (!saving.value) {
    emit('close');
  }
};

const handleConfirm = async () => {
  if (newManualCost.value !== null && newManualCost.value < 0) return;
  if (saving.value) return;

  try {
    saving.value = true;
    await updateReservation(props.reservationId, newManualCost.value);
    emit('updated');
    emit('close');
  } catch (error) {
    console.error('Failed to update cost:', error);
  } finally {
    saving.value = false;
  }
};
</script>
