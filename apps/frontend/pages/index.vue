<template>
  <main class="p-8">
    <h2 class="text-2xl font-semibold mb-4">Hello</h2>
    <p class="text-gray-600">Bientôt un peu de contenu ici.</p>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
