<template>
  <BaseIcon :class="props.class" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </BaseIcon>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>
