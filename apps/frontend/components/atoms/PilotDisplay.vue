<template>
  <BaseTag :variant="variant" rounded="rounded">
    <IconUser class="w-3 h-3 mr-1" />
    {{ displayName }}
  </BaseTag>
</template>

<script setup lang="ts">
import IconUser from '~/components/icons/IconUser.vue';

interface Props {
  displayName: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gray',
});
</script>
