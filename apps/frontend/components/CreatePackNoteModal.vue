<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Ajouter une note</h3>
      <div class="space-y-4">
        <div>
          <label for="note-content" class="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            id="note-content"
            v-model="content"
            rows="5"
            placeholder="Saisissez votre note..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        <div v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</div>
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            :disabled="saving || !content.trim()"
            class="flex-1 bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-2 rounded disabled:opacity-50"
            @click="handleConfirm"
          >
            {{ saving ? 'Enregistrement...' : 'Confirmer' }}
          </button>
          <button
            type="button"
            :disabled="saving"
            class="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm px-4 py-2 rounded disabled:opacity-50"
            @click="handleClose"
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
  packId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  created: [];
}>();

const { createPackNote } = usePack();

const content = ref('');
const saving = ref(false);
const errorMessage = ref<string | null>(null);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      content.value = '';
      errorMessage.value = null;
    }
  },
);

const handleClose = () => {
  if (!saving.value) {
    emit('close');
  }
};

const handleConfirm = async () => {
  if (!content.value.trim() || saving.value) return;

  try {
    saving.value = true;
    errorMessage.value = null;
    await createPackNote(props.packId, content.value.trim());
    emit('created');
    emit('close');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Une erreur est survenue.';
  } finally {
    saving.value = false;
  }
};
</script>
