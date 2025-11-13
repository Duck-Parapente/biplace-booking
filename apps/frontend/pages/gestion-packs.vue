<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <h2 class="text-2xl font-semibold mb-4 text-secondary-600">Gestion des Packs</h2>

      <div v-if="loading" class="p-4 text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 text-red-700">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto pb-20">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <!-- Pack List -->
          <div v-if="packs.length === 0" class="text-gray-500 text-sm">
            <p>Aucun pack créé pour le moment.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="pack in packs"
              :key="pack.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-secondary-600">{{ pack.label }}</h3>
                  <div class="mt-2 text-sm text-gray-600">
                    <p>
                      <span class="font-medium">Propriétaire:</span>
                      {{ getUserDisplayName(users.find((u) => u.id === pack.ownerId)) }}
                    </p>
                  </div>
                </div>
                <button
                  @click="openEditPackModal(pack)"
                  class="ml-4 bg-blue-600 text-white hover:bg-blue-700 transition text-sm px-3 py-1 rounded"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Button -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div class="max-w-4xl mx-auto">
        <button
          @click="openCreatePackModal"
          class="w-full bg-secondary-600 text-primary-400 hover:bg-secondary-700 transition text-sm px-4 py-3 rounded font-medium"
        >
          Ajouter un pack
        </button>
      </div>
    </div>

    <!-- Pack Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-secondary-600">
          {{ currentWordings.modalTitle }}
        </h3>
        <PackForm
          v-model="packForm"
          :users="users"
          :submitting="submitting"
          :error="submitError"
          :success="submitSuccess"
          :wordings="currentWordings"
          @submit="submitPack"
          @cancel="closeModal"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { UserDto } from 'shared';

definePageMeta({
  middleware: ['auth', 'admin'],
});

const {
  packs,
  loading,
  error,
  showModal,
  modalMode,
  submitting,
  submitError,
  submitSuccess,
  packForm,
  currentWordings,
  openCreatePackModal,
  openEditPackModal,
  closeModal,
  submitPack,
  initializePacks,
} = usePack();

const { getUsers } = useUser();
const { getUserDisplayName } = useUserHelpers();

const users = ref<UserDto[]>([]);
const loadingUsers = ref(false);

const loadUsers = async () => {
  try {
    loadingUsers.value = true;
    users.value = await getUsers();
  } catch (err) {
    console.error('Failed to load users:', err);
  } finally {
    loadingUsers.value = false;
  }
};

onMounted(() => {
  initializePacks();
  loadUsers();
});
</script>
