<template>
  <main class="p-8">
    <h2 class="text-2xl font-semibold mb-4">Mon Compte</h2>

    <div v-if="loading" class="mt-4">
      <p class="text-gray-500">Chargement des données utilisateur...</p>
    </div>

    <div v-else-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p><strong>Erreur:</strong> {{ error }}</p>
    </div>

    <div v-else-if="userData" class="mt-4">
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Informations du compte</h3>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{
          JSON.stringify(userData, null, 2)
        }}</pre>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { setPageTitle } = usePageTitle();
setPageTitle('Mon Compte');

const { callApi } = useApi();
const userData = ref(null);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    userData.value = await callApi('/user/me');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Impossible de charger les données utilisateur';
    console.error('Failed to fetch user data:', e);
  } finally {
    loading.value = false;
  }
});
</script>
