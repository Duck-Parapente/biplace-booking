<template>
  <BaseIcon :class="props.class">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </BaseIcon>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>
