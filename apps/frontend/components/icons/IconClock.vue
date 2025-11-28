<template>
  <BaseIcon :class="props.class">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </BaseIcon>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>
