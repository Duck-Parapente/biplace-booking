<template>
  <div class="bg-gray-50">
    <div class="overflow-x-auto px-3 py-2 max-w-[800px] mx-auto">
      <div class="flex gap-1.5 min-w-min">
        <button
          v-for="pack in sortedPacks"
          :key="pack.packId"
          @click="$emit('togglePack', pack.packId)"
          class="px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0"
          :class="
            selectedPacks.has(pack.packId)
              ? 'bg-secondary-600 text-white shadow-sm hover:bg-secondary-700 hover:shadow'
              : 'bg-gray-200/80 text-gray-700 hover:bg-gray-300/80'
          "
        >
          {{ pack.packLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PackPlanningDto } from 'shared';

defineProps<{
  sortedPacks: PackPlanningDto[];
  selectedPacks: Set<string>;
}>();

defineEmits<{
  togglePack: [packId: string];
}>();
</script>
