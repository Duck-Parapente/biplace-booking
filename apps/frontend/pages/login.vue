<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-secondary-600">
    <button
      class="bg-primary-400 hover:bg-secondary-600 hover:text-primary-400 transition text-secondary-600 px-8 py-4 rounded font-large"
      @click="login()"
    >
      Se connecter
    </button>
  </main>
</template>
<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
const { login } = useAuth();

const { setPageTitle } = usePageTitle();
setPageTitle('Connexion');
</script>
