<template>
  <div class="flex items-baseline gap-2">
    <p class="font-bold text-secondary-600">
      {{ formatDateLong(date).day }}
      {{ formatDateLong(date).month }}
    </p>
    <p class="text-gray-400 font-normal text-sm">({{ formatDateLong(date).weekday }})</p>
  </div>
</template>

<script setup lang="ts">
import { formatDateLong } from '~/composables/useDateHelpers';

interface Props {
  date: string;
}

const props = defineProps<Props>();
</script>
