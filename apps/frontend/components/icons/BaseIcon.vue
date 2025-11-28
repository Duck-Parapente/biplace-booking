<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :fill="fill"
    :viewBox="viewBox"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :class="props.class"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    class?: string;
    fill?: string;
    viewBox?: string;
    stroke?: string;
    strokeWidth?: string;
  }>(),
  {
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: '1.5',
  },
);
</script>
