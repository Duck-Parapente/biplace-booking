<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Modifier l'utilisateur</h3>

      <div v-if="user" class="-mx-6 mb-4 px-6 py-3 bg-gray-50 border-y border-gray-200">
        <p class="text-sm text-gray-600">
          <span class="font-medium">{{ user.firstName }} {{ user.lastName }}</span>
        </p>
        <p class="text-xs text-gray-500">{{ user.email }}</p>
      </div>

      <div class="space-y-4">
        <!-- Active Status -->
        <div>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="formData.isActive"
              type="checkbox"
              class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <span class="text-sm font-medium text-gray-700">Utilisateur actif</span>
          </label>
        </div>

        <!-- Active Until Date -->
        <div>
          <label for="active-until-input" class="block text-sm font-medium text-gray-700 mb-2">
            Actif jusqu'au (optionnel)
          </label>
          <input
            id="active-until-input"
            v-model="formData.activeUntil"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p class="text-xs text-gray-500 mt-1">
            Laissez vide pour une activation sans limite de temps
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-50 text-red-700 text-sm rounded">
          {{ errorMessage }}
        </div>

        <!-- Action Buttons -->
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
import type { UserDto } from 'shared';

interface Props {
  open: boolean;
  user: UserDto | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const { adminUpdateUser } = useUser();

const formData = ref({
  isActive: false,
  activeUntil: '',
});

const saving = ref(false);
const errorMessage = ref<string | null>(null);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.user) {
      let activeUntil = '';
      if (props.user.activeUntil) {
        const date = new Date(props.user.activeUntil);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        activeUntil = `${year}-${month}-${day}`;
      }

      formData.value = {
        isActive: props.user.isActive,
        activeUntil,
      };
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
  if (!props.user || saving.value) return;

  try {
    saving.value = true;
    errorMessage.value = null;

    await adminUpdateUser(props.user.id, {
      isActive: formData.value.isActive,
      activeUntil: formData.value.activeUntil ? new Date(formData.value.activeUntil) : null,
    });

    emit('updated');
    emit('close');
  } catch (error) {
    console.error('Failed to update user:', error);
    errorMessage.value =
      error instanceof Error ? error.message : "Impossible de mettre à jour l'utilisateur";
  } finally {
    saving.value = false;
  }
};
</script>
