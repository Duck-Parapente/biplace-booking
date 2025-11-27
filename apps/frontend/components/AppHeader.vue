<template>
  <div
    v-if="maintenanceMode"
    class="w-full bg-orange-500 text-white px-6 py-3 text-center font-semibold"
  >
    ⚠️ Mode maintenance activé - Des opérations de maintenance sont en cours
  </div>

  <header
    :class="$attrs.class"
    class="w-full flex items-center justify-between px-6 py-4 bg-primary-400 text-secondary-600"
  >
    <NuxtLink
      to="/"
      class="flex items-center gap-2 text-xl font-semibold hover:opacity-80 transition-opacity -my-2 py-2 -ml-2 pl-2 pr-4"
    >
      <img src="/duck-logo.png" alt="Duck Logo" class="h-8 w-8" />
      <span>Biplace</span>
    </NuxtLink>

    <div v-if="isAuthenticated" class="flex items-center gap-3">
      <button
        class="text-secondary-600 hover:opacity-80 transition-opacity -my-2 -mr-2 p-2"
        @click="isMenuOpen = true"
        aria-label="Ouvrir le menu"
      >
        <IconMenu class="h-6 w-6" />
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
            <IconX class="h-6 w-6" />
          </button>
        </div>

        <!-- Menu content -->
        <nav class="flex-1 flex flex-col items-center justify-center gap-8">
          <NuxtLink
            v-for="item in visibleMenuItems"
            :key="item.path"
            :to="item.path"
            class="text-secondary-600 text-2xl font-semibold hover:opacity-80 transition-opacity"
            @click="isMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>

          <button
            class="bg-secondary-600 text-primary-400 transition text-lg px-6 py-3 rounded hover:opacity-90"
            @click="handleLogout()"
          >
            Se déconnecter
          </button>
        </nav>

        <!-- Footer -->
        <div class="pb-6 text-center">
          <a
            :href="`mailto:${config.public.supportEmail}`"
            class="text-secondary-600 text-sm hover:opacity-80 transition-opacity inline-block px-8 py-3"
          >
            Une question ou remarque ?
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { UserRoles } from 'shared';
import { computed, ref } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const config = useRuntimeConfig();
const { logout, isAuthenticated, hasRole } = useAuth();
const { maintenanceMode } = usePublicConfig();
const isMenuOpen = ref(false);

interface MenuItem {
  path: string;
  label: string;
  requiresRole?: UserRoles;
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'Mes demandes' },
  { path: '/planning', label: 'Planning' },
  { path: '/mon-compte', label: 'Mon compte' },
  { path: '/contacts', label: 'Contacts' },
  { path: '/gestion-packs', label: 'Gestion des Packs', requiresRole: UserRoles.ADMIN },
];

const visibleMenuItems = computed(() => {
  return menuItems.filter((item) => {
    if (!item.requiresRole) return true;
    return hasRole(item.requiresRole);
  });
});

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
