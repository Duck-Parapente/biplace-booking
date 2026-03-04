<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-secondary-600">
    <button
      class="bg-primary-400 hover:bg-secondary-600 hover:text-primary-400 transition text-secondary-600 px-8 py-4 rounded font-large"
      @click="login()"
    >
      Se connecter
    </button>
    <NuxtLink to="/faq" class="mt-6 text-primary-400 hover:text-primary-300 transition underline">
      Besoin d'aide ? Consultez notre FAQ
    </NuxtLink>

    <!-- Brave Browser Warning -->
    <div
      v-if="isBrave"
      class="absolute bottom-0 left-0 right-0 bg-primary-400/10 backdrop-blur-sm text-primary-400 text-xs py-2 px-4 text-center"
    >
      💡 Pense à désactiver les boucliers de Brave, sinon tu ne pourras pas te connecter
    </div>
  </main>
</template>
<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  pageTitle: 'Connexion',
});

const { login } = useAuth();

// Detect Brave browser
const isBrave = ref(false);

onMounted(async () => {
  // Brave browser detection
  if ((navigator as any).brave && (await (navigator as any).brave.isBrave())) {
    isBrave.value = true;
  }
});
</script>
