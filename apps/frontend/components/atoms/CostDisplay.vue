<template>
  <span class="inline-flex items-center gap-1 text-xs font-medium" aria-label="Coût de réservation">
    <span>{{ cost }}</span>
    <IconDuck class="w-3.5 h-3.5" />
  </span>
</template>

<script setup lang="ts">
interface Props {
  cost: number;
}

defineProps<Props>();
</script>
