<template>
  <header
    class="w-full flex items-center justify-between px-6 py-4 bg-primary-400 text-secondary-600"
  >
    <NuxtLink
      to="/"
      class="text-xl font-semibold hover:opacity-80 transition-opacity -my-2 py-2 -ml-2 pl-2 pr-4"
    >
      Duck
    </NuxtLink>

    <div v-if="isAuthenticated" class="flex items-center gap-3">
      <button
        class="text-secondary-600 hover:opacity-80 transition-opacity -my-2 -mr-2 p-2"
        @click="isMenuOpen = true"
        aria-label="Ouvrir le menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  </header>

  <!-- Fullscreen Burger Menu -->
  <Teleport to="body">
    <Transition name="menu">
      <div v-if="isMenuOpen" class="fixed inset-0 bg-primary-400 z-50 flex flex-col">
        <!-- Close button -->
        <div class="w-full flex items-center justify-end px-6 py-4">
          <button
            class="text-secondary-600 hover:opacity-80 transition-opacity"
            @click="isMenuOpen = false"
            aria-label="Fermer le menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Menu content -->
        <nav class="flex-1 flex flex-col items-center justify-center gap-8">
          <button
            class="bg-secondary-600 text-primary-400 transition text-lg px-6 py-3 rounded hover:opacity-90"
            @click="handleLogout()"
          >
            Se déconnecter
          </button>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useAuth } from '~/composables/useAuth';

const { logout, isAuthenticated } = useAuth();
const isMenuOpen = ref(false);

const handleLogout = () => {
  isMenuOpen.value = false;
  logout();
};
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
