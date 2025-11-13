<template>
  <form @submit.prevent="emit('submit')" class="space-y-4">
    <BaseInput id="label" v-model="localForm.label" label="Label" type="text" required />

    <BaseAutocomplete
      id="ownerSearch"
      v-model="ownerSearch"
      :options="userOptions"
      label="Propriétaire"
      required
      placeholder="Rechercher un propriétaire..."
      no-results-text="Aucun utilisateur trouvé"
      @select="handleOwnerSelect"
    />

    <BaseInput
      id="flightsHours"
      v-model="localForm.flightsHours"
      label="Heures de vol"
      type="number"
      :min="0"
      :step="0.5"
    />

    <BaseInput
      id="flightsCount"
      v-model="localForm.flightsCount"
      label="Nombre de vols"
      type="number"
      :min="0"
    />

    <div v-if="error" class="p-3 bg-red-50 text-red-700 text-sm">
      <p><strong>Erreur:</strong> {{ error }}</p>
    </div>

    <div v-if="success" class="p-3 bg-primary-400/20 text-secondary-600 text-sm">
      <p>{{ wordings.successMessage }}</p>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        :disabled="submitting"
        class="flex-1 bg-secondary-600 text-primary-400 hover:bg-secondary-700 transition text-sm px-4 py-2 rounded disabled:opacity-50"
      >
        {{ submitting ? wordings.submittingButton : wordings.submitButton }}
      </button>
      <button
        type="button"
        @click="emit('cancel')"
        class="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm px-4 py-2 rounded"
      >
        Annuler
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CreatePackDto, UserDto, UpdatePackDto } from 'shared';

import type { PackFormWordings } from '~/composables/usePack';

interface Props {
  users: UserDto[];
  submitting: boolean;
  error: string | null;
  success: boolean;
  modelValue: CreatePackDto | UpdatePackDto;
  wordings: PackFormWordings;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [];
  cancel: [];
  'update:modelValue': [value: CreatePackDto | UpdatePackDto];
}>();

const localForm = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const ownerSearch = ref('');
const { getUserDisplayName } = useUserHelpers();

const userOptions = computed(() =>
  props.users.map((user) => ({
    value: user.id,
    label: getUserDisplayName(user),
    description: user.email,
  })),
);

const handleOwnerSelect = (userId: string) => {
  emit('update:modelValue', { ...localForm.value, ownerId: userId });
};

watch(ownerSearch, (newValue) => {
  if (!newValue) {
    emit('update:modelValue', { ...localForm.value, ownerId: '' });
  }
});

watch(
  () => props.modelValue.ownerId,
  (ownerId) => {
    if (ownerId && !ownerSearch.value) {
      const user = props.users.find((u) => u.id === ownerId);
      if (user) {
        ownerSearch.value = getUserDisplayName(user);
      }
    } else if (!ownerId) {
      ownerSearch.value = '';
    }
  },
  { immediate: true },
);
</script>
