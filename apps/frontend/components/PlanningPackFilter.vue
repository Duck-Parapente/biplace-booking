<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg">
    <div class="overflow-x-auto px-3 py-2 max-w-[800px] mx-auto">
      <div class="flex gap-1.5 min-w-min">
        <button
          v-for="pack in sortedPacks"
          :key="pack.packId"
          @click="$emit('togglePack', pack.packId)"
          class="px-2.5 py-1 text-sm rounded transition whitespace-nowrap flex-shrink-0"
          :class="
            selectedPacks.has(pack.packId)
              ? 'bg-secondary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
