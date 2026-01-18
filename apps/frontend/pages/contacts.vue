<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">Chargement...</p>
      </div>

      <div v-else-if="error" class="p-3 bg-red-50 text-red-700">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <template v-else>
        <!-- Header and Search -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un contact..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
          />
          <p class="text-sm text-gray-500 mt-2">{{ filteredUsers.length }} contact(s)</p>
        </div>

        <div v-if="filteredUsers.length > 0" class="space-y-3 flex-1 min-h-0 overflow-y-auto pb-4">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all duration-200 overflow-hidden"
            :class="{ 'cursor-pointer': isAdmin }"
            @click="isAdmin ? openEditModal(user) : null"
          >
            <div class="p-4">
              <!-- Header with name and status -->
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">
                    {{ user.firstName }} {{ user.lastName }}
                  </h3>
                  <p v-if="user.address" class="text-sm text-gray-500 mt-0.5 truncate">
                    📍 {{ user.address }}
                  </p>
                </div>

                <!-- Admin badges -->
                <div v-if="isAdmin" class="flex flex-col items-end gap-1.5">
                  <span
                    :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                      user.isActive
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200',
                    ]"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="user.isActive ? 'bg-green-600' : 'bg-red-600'"
                    ></span>
                    {{ user.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                  <span
                    v-if="user.activeUntil"
                    class="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200"
                  >
                    Jusqu'au {{ new Date(user.activeUntil).toLocaleDateString('fr-FR') }}
                  </span>
                </div>
              </div>

              <!-- Contact links -->
              <div class="flex flex-wrap gap-2 mt-3">
                <a
                  v-if="user.phoneNumber"
                  :href="`tel:${user.phoneNumber}`"
                  class="px-3 py-1.5 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-md hover:from-primary-100 hover:to-primary-200 transition-all duration-200 text-sm font-medium border border-primary-200 shadow-sm hover:shadow"
                  @click.stop
                >
                  📞 {{ user.phoneNumber }}
                </a>
                <a
                  v-if="user.email"
                  :href="`mailto:${user.email}`"
                  class="px-3 py-1.5 bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 rounded-md hover:from-secondary-100 hover:to-secondary-200 transition-all duration-200 text-sm font-medium border border-secondary-200 shadow-sm hover:shadow"
                  @click.stop
                >
                  ✉️ {{ user.email }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 font-medium">Aucun contact trouvé</p>
          <p class="text-sm text-gray-400 mt-1">Essayez de modifier votre recherche</p>
        </div>
      </template>
    </div>

    <!-- Edit User Modal -->
    <EditUserModal
      :open="editModalOpen"
      :user="selectedUser"
      @close="closeEditModal"
      @updated="handleUserUpdated"
    />
  </main>
</template>

<script setup lang="ts">
import { chain, filter } from 'lodash';
import type { UserDto } from 'shared';
import { UserRoles } from 'shared';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Contacts',
});

const { getUsers, isProfileComplete } = useUser();
const { hasRole } = useAuth();
const isAdmin = computed(() => hasRole(UserRoles.ADMIN));

const users = ref<UserDto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const editModalOpen = ref(false);
const selectedUser = ref<UserDto | null>(null);

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return users.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return filter(users.value, ({ firstName, lastName, phoneNumber, email }) => {
    return [firstName, lastName, phoneNumber, email]
      .map((value) => (value || '').toLowerCase())
      .join(' ')
      .includes(query);
  });
});

const loadUsers = async () => {
  const response = await getUsers();
  users.value = chain(response)
    .filter(isProfileComplete)
    .orderBy([(user) => user.lastName || ''], ['asc'])
    .value();
};

const openEditModal = (user: UserDto) => {
  selectedUser.value = user;
  editModalOpen.value = true;
};

const closeEditModal = () => {
  editModalOpen.value = false;
  selectedUser.value = null;
};

const handleUserUpdated = async () => {
  try {
    await loadUsers();
  } catch (e: any) {
    console.error('Error reloading users:', e);
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    await loadUsers();
  } catch (e: any) {
    console.error('Error loading users:', e);
    error.value = e.message || 'Impossible de charger les contacts';
  } finally {
    loading.value = false;
  }
});
</script>
