<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-secondary">
    <button
      class="bg-primary hover:bg-secondary hover:text-white transition text-secondary px-8 py-4 rounded font-large"
      @click="login()"
    >
      Se connecter
    </button>
  </main>
</template>
<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
const { login } = useAuth();
</script>
