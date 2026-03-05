<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Créer un nouveau contact</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
            <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            placeholder="email@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            :disabled="saving"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-50 text-red-700 text-sm rounded">
          {{ errorMessage }}
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="saving || !formData.email.trim()"
            class="flex-1 bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {{ saving ? 'Création...' : 'Créer' }}
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
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const { createUser } = useUser();

const formData = ref({
  email: '',
});

const saving = ref(false);
const errorMessage = ref<string | null>(null);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      formData.value = {
        email: '',
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

const handleSubmit = async () => {
  if (!formData.value.email.trim() || saving.value) return;

  try {
    saving.value = true;
    errorMessage.value = null;

    await createUser(formData.value.email);

    emit('created');
    emit('close');
  } catch (error) {
    console.error('Failed to create user:', error);
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de créer le contact';
  } finally {
    saving.value = false;
  }
};
</script>
