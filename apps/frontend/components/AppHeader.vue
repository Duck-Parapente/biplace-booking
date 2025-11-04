<template>
  <header
    class="w-full flex items-center justify-between px-6 py-4 bg-primary-400 text-secondary-600"
  >
    <h1 class="text-xl font-semibold">Duck</h1>
    <div v-if="isAuthenticated" class="flex items-center gap-3">
      <span class="text-sm">🪂</span>
      <button
        class="bg-secondary-600 text-primary-400 transition text-xs px-3 py-1.5 rounded"
        @click="logout()"
      >
        Se déconnecter
      </button>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { logout, isAuthenticated } = useAuth();
</script>
