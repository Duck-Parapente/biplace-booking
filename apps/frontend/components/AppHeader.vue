<template>
  <header
    class="w-full flex items-center justify-between px-6 py-4 bg-primary-400 text-secondary-600"
  >
    <h1 class="text-xl font-semibold">Biplace Duckparapente</h1>
    <div v-if="isAuthenticated" class="flex items-center gap-3">
      <span v-if="user?.name" class="text-sm">🪂 {{ user.name }}</span>
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
const { login, logout, isAuthenticated, user, isLoading } = useAuth();
</script>
