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

      <div v-else class="flex-1 overflow-y-auto">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="mb-6">
            <button
              @click="openCreatePackModal"
              class="bg-secondary-600 text-primary-400 hover:bg-secondary-700 transition text-sm px-4 py-2 rounded"
            >
              Ajouter un pack
            </button>
          </div>

          <!-- Future: Pack list will be displayed here -->
          <div class="text-gray-500 text-sm">
            <p>La liste des packs sera affichée ici.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Pack Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeCreatePackModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-secondary-600">Ajouter un pack</h3>
        <PackCreateForm
          v-model="packForm"
          :users="users"
          :submitting="creating"
          :error="createError"
          :success="createSuccess"
          @submit="createPack"
          @cancel="closeCreatePackModal"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { UserDto } from 'shared';

definePageMeta({
  middleware: 'admin',
});

const {
  loading,
  error,
  showCreateModal,
  creating,
  createError,
  createSuccess,
  packForm,
  openCreatePackModal,
  closeCreatePackModal,
  createPack,
  initializePacks,
} = usePack();

const { getUsers } = useUser();

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
