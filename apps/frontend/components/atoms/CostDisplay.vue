<template>
  <div
    class="flex items-center gap-1 text-xs text-primary-700 font-semibold"
    aria-label="Coût de réservation"
  >
    <span class="text-primary-800">{{ cost }}</span>
    <IconDuck class="w-4 h-4 fill-primary-800" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  cost: number;
}

defineProps<Props>();
</script>
