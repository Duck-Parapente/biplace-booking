<template>
  <main class="p-4 max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4 text-secondary-600">Contacts</h2>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Chargement...</p>
    </div>

    <div v-else-if="error" class="p-3 bg-red-50 text-red-700">
      <p><strong>Erreur:</strong> {{ error }}</p>
    </div>

    <div v-else-if="users.length > 0" class="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div
        v-for="user in users"
        :key="user.id"
        class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-secondary-600">
              {{ user.firstName }} {{ user.lastName }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              Score: <span class="font-medium">{{ user.currentScore || 0 }}</span>
            </p>
          </div>

          <div class="flex flex-col gap-2 sm:items-end">
            <a
              v-if="user.phoneNumber"
              :href="`tel:${user.phoneNumber}`"
              class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              📞 {{ user.phoneNumber }}
            </a>
            <a
              v-if="user.email"
              :href="`mailto:${user.email}`"
              class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              ✉️ {{ user.email }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <p>Aucun contact disponible</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { UserDto } from 'shared';

definePageMeta({
  middleware: 'auth',
});

const { getUsers } = useUser();

const users = ref<UserDto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await getUsers();
    users.value = response;
  } catch (e: any) {
    console.error('Error loading users:', e);
    error.value = e.message || 'Impossible de charger les contacts';
  } finally {
    loading.value = false;
  }
});
</script>
