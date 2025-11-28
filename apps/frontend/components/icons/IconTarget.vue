<template>
  <BaseIcon :class="props.class" stroke-width="2" fill="none">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <line x1="12" y1="2" x2="12" y2="6" stroke-linecap="round" />
    <line x1="12" y1="18" x2="12" y2="22" stroke-linecap="round" />
    <line x1="2" y1="12" x2="6" y2="12" stroke-linecap="round" />
    <line x1="18" y1="12" x2="22" y2="12" stroke-linecap="round" />
  </BaseIcon>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>
