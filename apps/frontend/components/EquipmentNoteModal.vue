<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">
        {{ note ? 'Modifier la note' : 'Ajouter une note' }}
      </h3>
      <div class="space-y-4">
        <div>
          <label for="equipment-note-content" class="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            id="equipment-note-content"
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
import type { EquipmentNoteDto } from 'shared';

interface Props {
  open: boolean;
  equipmentId: string;
  note?: EquipmentNoteDto | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  created: [];
  updated: [];
}>();

const { createEquipmentNote, updateEquipmentNote } = useEquipment();

const content = ref('');
const saving = ref(false);
const errorMessage = ref<string | null>(null);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      content.value = props.note?.content ?? '';
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

    if (props.note) {
      await updateEquipmentNote(props.equipmentId, props.note.id, content.value.trim());
      emit('updated');
    } else {
      await createEquipmentNote(props.equipmentId, content.value.trim());
      emit('created');
    }

    emit('close');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Une erreur est survenue.';
  } finally {
    saving.value = false;
  }
};
</script>
