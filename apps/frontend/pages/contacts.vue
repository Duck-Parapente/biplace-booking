<template>
  <main class="p-4 max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4 text-secondary-600">Contacts</h2>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Chargement...</p>
    </div>

    <div v-else-if="error" class="p-3 bg-red-50 text-red-700">
      <p><strong>Erreur:</strong> {{ error }}</p>
    </div>

    <template v-else>
      <!-- Search filter -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par prénom, nom, etc."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
        />
      </div>

      <div
        v-if="filteredUsers.length > 0"
        class="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto"
      >
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-secondary-600">
                {{ user.firstName }} {{ user.lastName }}
              </h3>
            </div>

            <div class="flex flex-col gap-2 sm:items-end">
              <a
                v-if="user.phoneNumber"
                :href="`tel:${user.phoneNumber}`"
                class="text-sm text-secondary-600 hover:opacity-80 transition-opacity"
              >
                📞 {{ user.phoneNumber }}
              </a>
              <a
                v-if="user.email"
                :href="`mailto:${user.email}`"
                class="text-sm text-secondary-600 hover:opacity-80 transition-opacity"
              >
                ✉️ {{ user.email }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <p>Aucun contact trouvé</p>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { filter, orderBy } from 'lodash';
import type { UserDto } from 'shared';

definePageMeta({
  middleware: 'auth',
});

const { getUsers } = useUser();

const users = ref<UserDto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');

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

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await getUsers();
    users.value = orderBy(response, [(user) => user.lastName || ''], ['asc']);
  } catch (e: any) {
    console.error('Error loading users:', e);
    error.value = e.message || 'Impossible de charger les contacts';
  } finally {
    loading.value = false;
  }
});
</script>
