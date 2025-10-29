<template>
  <header class="w-full flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
    <h1 class="text-xl font-semibold">Biplace Duck parapente</h1>
    <div>
      <button
        v-if="!isAuthenticated"
        class="bg-emerald-500 hover:bg-emerald-600 transition text-sm px-4 py-2 rounded font-medium"
        @click="login()"
      >
        Se connecter
      </button>
      <div v-else class="flex items-center gap-3">
        <span class="text-sm">{{ user?.name }}</span>
        <button
          class="bg-slate-700 hover:bg-slate-600 transition text-xs px-3 py-1.5 rounded"
          @click="logout({ logoutParams: { returnTo: window.location.origin } })"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
const { login, logout, isAuthenticated, user } = useAuth();
</script>
