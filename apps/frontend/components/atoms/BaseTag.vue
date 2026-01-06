<template>
  <component
    :is="as"
    class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium"
    :class="[variantClasses, roundedClasses]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  rounded?: 'squared' | 'rounded' | 'full';
  as?: 'span' | 'button';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gray',
  rounded: 'full',
  as: 'span',
});

const roundedClasses = computed(() => {
  const roundings = {
    squared: 'rounded-sm',
    rounded: 'rounded-md',
    full: 'rounded-full',
  };
  return roundings[props.rounded];
});

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-700',
    secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-700',
    success: 'bg-green-50 text-green-700 border border-green-700',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-700',
    danger: 'bg-red-50 text-red-700 border border-red-700',
    info: 'bg-blue-50 text-blue-700 border border-blue-700',
    gray: 'bg-gray-50 text-gray-700 border border-gray-700',
  };
  return variants[props.variant];
});
</script>
