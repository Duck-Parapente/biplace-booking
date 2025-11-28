<template>
  <BaseIcon :class="props.class" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </BaseIcon>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>
