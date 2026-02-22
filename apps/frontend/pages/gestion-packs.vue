<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-3 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <div v-if="loading" class="text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto pb-20">
        <div class="rounded-lg shadow-sm">
          <!-- Pack List -->
          <div v-if="filteredPacks.length === 0" class="text-gray-500 text-sm">
            <p>Aucun pack créé pour le moment.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="pack in filteredPacks"
              :key="pack.id"
              class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div class="bg-secondary-100 px-3 py-2">
                <h3 class="text-lg font-semibold text-secondary-700">{{ pack.label }}</h3>
              </div>
              <div class="px-3 py-2 flex justify-between items-center">
                <div class="text-sm text-gray-600">
                  <p>
                    <span class="font-medium">Responsable:</span>
                    {{ getUserDisplayName(users.find((u) => u.id === pack.ownerId)) }}
                  </p>
                </div>
                <button
                  @click="openEditPackModal(pack)"
                  class="ml-4 px-4 py-2 text-gray-400 hover:text-secondary-600 hover:bg-secondary-100 transition rounded-lg"
                  title="Modifier"
                >
                  <IconPencil class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Button -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg"
      v-if="isAdmin"
    >
      <div class="max-w-4xl mx-auto">
        <button
          @click="openCreatePackModal"
          class="w-full bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-3 rounded font-medium"
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
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-semibold mb-4 text-secondary-600">
          {{ currentOperationConfig.modalTitle }}
        </h3>
        <PackForm
          v-model="packForm"
          :users="users"
          :submitting="submitting"
          :error="submitError"
          :success="submitSuccess"
          :currentOperationConfig="currentOperationConfig"
          @submit="submitPack"
          @cancel="closeModal"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'moderator'],
  pageTitle: 'Gestion des Packs',
});

const {
  filteredPacks,
  loading,
  error,
  showModal,
  submitting,
  submitError,
  submitSuccess,
  packForm,
  currentOperationConfig,
  openCreatePackModal,
  openEditPackModal,
  closeModal,
  submitPack,
  getPacks,
} = usePack();
const { isAdmin } = useAuth();

const { users, getUser, getUsers } = useUser();
const { getUserDisplayName } = useUserHelpers();

onMounted(() => {
  getPacks();
  getUser();
  getUsers();
});
</script>
