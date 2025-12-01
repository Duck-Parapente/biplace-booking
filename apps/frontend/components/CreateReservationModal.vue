<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold mb-4 text-secondary-600">Créer une réservation</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="startingDate"
          v-model="form.startingDate"
          label="Date de début"
          type="date"
          required
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Pack
            <span class="text-red-500">*</span>
          </label>
          <BaseAutocomplete
            id="packSearch"
            v-model="packSearch"
            :options="packOptions"
            placeholder="Rechercher un pack..."
            no-results-text="Aucun pack trouvé"
            @select="handlePackSelect"
          />
          <div v-if="selectedPack" class="mt-2">
            <div
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
            >
              {{ selectedPack.label }}
              <button type="button" @click="clearPackSelection" class="hover:text-secondary-900">
                <IconXCircle class="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Utilisateur (optionnel)
          </label>
          <BaseAutocomplete
            id="userSearch"
            v-model="userSearch"
            :options="userOptions"
            placeholder="Rechercher un utilisateur..."
            no-results-text="Aucun utilisateur trouvé"
            @select="handleUserSelect"
          />
          <div v-if="selectedUser" class="mt-2">
            <div
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
            >
              {{ getUserDisplayName(selectedUser) }}
              <button type="button" @click="clearUserSelection" class="hover:text-secondary-900">
                <IconXCircle class="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Commentaire public (optionnel)
          </label>
          <textarea
            v-model="form.publicComment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            rows="3"
            placeholder="Ajoutez un commentaire..."
          ></textarea>
        </div>

        <div v-if="submitError" class="p-3 bg-red-50 text-red-700 text-sm">
          <p><strong>Erreur:</strong> {{ submitError }}</p>
        </div>

        <div v-if="submitSuccess" class="p-3 bg-primary-400/20 text-secondary-600 text-sm">
          <p>✓ Réservation créée avec succès</p>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="submitting || submitSuccess || !isFormValid"
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
import type { CreateReservationDto } from 'shared';
import { UserRoles } from 'shared';

interface Props {
  show: boolean;
  modelValue: CreateReservationDto;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit'): void;
  (e: 'update:modelValue', value: CreateReservationDto): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const { getUserDisplayName } = useUserHelpers();
const { packs, users, loadData, submitReservation, submitting, submitError, submitSuccess } =
  useReservationForm();
const { hasRole } = useAuth();
const { getUser } = useUser();

// Form state with computed setter for two-way binding
const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Selection state (for autocomplete search)
const packSearch = ref('');
const userSearch = ref('');

// Derive selected entities from form IDs (cached by computed)
const selectedPack = computed(() => packs.value.find((p) => p.id === form.value.packId) ?? null);
const selectedUser = computed(() => users.value.find((u) => u.id === form.value.userId) ?? null);

const currentUser = ref<{ id: string } | null>(null);

const filteredPacks = computed(() => {
  if (hasRole(UserRoles.ADMIN)) {
    return packs.value;
  }

  if (hasRole(UserRoles.MANAGER) && currentUser.value) {
    return packs.value.filter((pack) => pack.ownerId === currentUser.value?.id);
  }

  return [];
});

// Autocomplete options
const packOptions = computed(() => {
  const searchTerm = packSearch.value?.toLowerCase();
  return filteredPacks.value
    .filter((pack) => !searchTerm || pack.label.toLowerCase().includes(searchTerm))
    .map((pack) => ({
      value: pack.id,
      label: pack.label,
    }));
});

const userOptions = computed(() => {
  if (!userSearch.value) return [];

  const searchTerm = userSearch.value.toLowerCase();
  return users.value
    .filter((user) => {
      const displayName = getUserDisplayName(user);
      if (!displayName) return false;
      const email = user.email?.toLowerCase() || '';
      return displayName.toLowerCase().includes(searchTerm) || email.includes(searchTerm);
    })
    .map((user) => ({
      value: user.id,
      label: getUserDisplayName(user) || '',
    }));
});

// Form validation - check model state, not UI state
const isFormValid = computed(() => {
  return !!(form.value.packId && form.value.startingDate);
});

// Selection handlers - update form directly
const handlePackSelect = (packId: string) => {
  form.value.packId = packId;
  packSearch.value = '';
};

const handleUserSelect = (userId: string) => {
  form.value.userId = userId;
  userSearch.value = '';
};

const clearPackSelection = () => {
  form.value.packId = '';
};

const clearUserSelection = () => {
  form.value.userId = undefined;
};

// Form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    await submitReservation(form.value);
    emit('submit');

    setTimeout(() => {
      emit('close');
    }, 1000);
  } catch {
    // Error is already handled in the composable
  }
};

// Reset form when modal opens
const resetForm = () => {
  packSearch.value = '';
  userSearch.value = '';
};

// Watch for modal open/close
watch(
  () => props.show,
  async (isOpen) => {
    if (isOpen) {
      resetForm();
      await loadData();

      // Load current user data for filtering
      try {
        const user = await getUser();
        currentUser.value = { id: user.id };
      } catch (err) {
        console.error('Failed to load current user:', err);
      }
    }
  },
);
</script>
