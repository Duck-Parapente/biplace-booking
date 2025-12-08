<template>
  <div class="flex items-center gap-1.5 px-2 py-1 rounded" :class="containerClass">
    <IconUser class="w-3.5 h-3.5" :class="iconClass" />
    <span :class="textClass">{{ displayName }}</span>
  </div>
</template>

<script setup lang="ts">
import IconUser from '~/components/icons/IconUser.vue';

interface Props {
  displayName: string;
  variant?: 'default' | 'reserved';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const containerClass = computed(() => {
  return props.variant === 'reserved' ? 'bg-red-100' : 'bg-gray-100';
});

const iconClass = computed(() => {
  return props.variant === 'reserved' ? 'text-red-800' : 'text-gray-700';
});

const textClass = computed(() => {
  return props.variant === 'reserved' ? 'text-red-800' : 'text-gray-700';
});
</script>
