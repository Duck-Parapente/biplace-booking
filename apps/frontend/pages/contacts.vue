<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-3 max-w-4xl mx-auto w-full flex flex-col min-h-0">
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

          <!-- Contact count and Sort Controls -->
          <div class="flex items-center justify-between mt-2">
            <p class="text-sm text-gray-500">{{ filteredUsers.length }} contact(s)</p>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Trier par:</span>
              <select
                v-model="sortBy"
                class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                @change="loadUsers"
              >
                <option value="firstName">Prénom</option>
                <option value="lastName">Nom</option>
              </select>
              <button
                @click="toggleSortOrder"
                class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm transition-colors"
                :title="sortOrder === 'asc' ? 'Croissant' : 'Décroissant'"
              >
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredUsers.length > 0" class="space-y-3 flex-1 min-h-0 overflow-y-auto pb-4">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all duration-200 overflow-hidden"
            :class="{ 'cursor-pointer': isAdmin }"
            @click="isAdmin ? openEditModal(user) : null"
          >
            <div class="p-3">
              <!-- Header with name and contact icons -->
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">
                    <template v-if="user.firstName || user.lastName">
                      {{ user.firstName }} {{ user.lastName }}
                    </template>
                    <template v-else>
                      {{ user.email }}
                    </template>
                  </h3>
                  <p v-if="user.address" class="text-sm text-gray-500 mt-0.5 truncate">
                    📍 {{ user.address }}
                  </p>

                  <!-- Admin badges below address -->
                  <div v-if="isAdmin" class="flex flex-wrap items-center gap-2 mt-2">
                    <span :class="userStatus(user).badgeClasses">
                      <span :class="userStatus(user).dotClasses"></span>
                      {{ userStatus(user).label }}
                    </span>
                    <span
                      v-if="user.activeUntil"
                      class="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200"
                    >
                      Jusqu'au {{ new Date(user.activeUntil).toLocaleDateString('fr-FR') }}
                    </span>
                    <span
                      v-if="user.currentScore !== undefined && user.currentScore !== null"
                      class="text-xs text-gray-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200"
                    >
                      Coins: {{ user.currentScore }}
                    </span>
                  </div>
                </div>

                <!-- Contact icons vertically -->
                <div class="flex flex-col gap-1.5">
                  <a
                    v-if="user.phoneNumber"
                    :href="`tel:${user.phoneNumber}`"
                    class="px-2 py-1 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-md hover:from-primary-100 hover:to-primary-200 transition-all duration-200 text-base border border-primary-200 shadow-sm hover:shadow"
                    :title="user.phoneNumber"
                    @click.stop
                  >
                    📞
                  </a>
                  <a
                    v-if="user.email"
                    :href="`mailto:${user.email}`"
                    class="px-2 py-1 bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 rounded-md hover:from-secondary-100 hover:to-secondary-200 transition-all duration-200 text-base border border-secondary-200 shadow-sm hover:shadow"
                    :title="user.email"
                    @click.stop
                  >
                    ✉️
                  </a>
                </div>
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
      @updated="refreshUsersList"
    />

    <!-- Create User Button - Fixed bottom right (only for Admin) -->
    <button
      v-if="isAdmin"
      @click="openCreateUserModal"
      class="fixed bottom-4 right-4 bg-secondary-600 text-white rounded-full p-4 shadow-lg hover:bg-secondary-700 transition z-50"
      aria-label="Créer un nouveau contact"
    >
      <IconPlus class="w-6 h-6" />
    </button>

    <!-- Create User Modal -->
    <CreateUserModal
      :open="showCreateUserModal"
      @close="closeCreateUserModal"
      @created="refreshUsersList"
    />
  </main>
</template>

<script setup lang="ts">
import { chain, filter } from 'lodash';
import type { UserDto } from 'shared';

import IconPlus from '~/components/icons/IconPlus.vue';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Contacts',
});

const { getUsers } = useUser();
const { isAdmin } = useAuth();

const users = ref<UserDto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const { value: sortBy } = useLocalStorage<'firstName' | 'lastName'>('contacts_sortBy', 'lastName');
const { value: sortOrder } = useLocalStorage<'asc' | 'desc'>('contacts_sortOrder', 'asc');
const editModalOpen = ref(false);
const selectedUser = ref<UserDto | null>(null);
const showCreateUserModal = ref(false);

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

const { getDisplay: userStatus } = useUserStatus();

const loadUsers = async () => {
  const response = await getUsers();
  users.value = chain(response)
    .orderBy([(user) => (user[sortBy.value] || user.email || '').toLowerCase()], [sortOrder.value])
    .value();
};

const toggleSortOrder = async () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  await loadUsers();
};

const openEditModal = (user: UserDto) => {
  selectedUser.value = user;
  editModalOpen.value = true;
};

const closeEditModal = () => {
  editModalOpen.value = false;
  selectedUser.value = null;
};

const refreshUsersList = async () => {
  try {
    await loadUsers();
  } catch (e: any) {
    console.error('Error reloading users:', e);
  }
};

const openCreateUserModal = () => {
  showCreateUserModal.value = true;
};

const closeCreateUserModal = () => {
  showCreateUserModal.value = false;
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
