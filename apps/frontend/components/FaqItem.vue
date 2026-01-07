<template>
  <div class="border-b border-gray-200">
    <button
      class="w-full py-4 px-6 text-left flex justify-between items-center hover:bg-gray-200 transition-colors bg-gray-100"
      @click="isOpen = !isOpen"
    >
      <h3 class="text-lg font-semibold text-gray-900 pr-4">{{ question }}</h3>
      <IconChevronRight
        :class="
          isOpen
            ? 'w-5 h-5 text-gray-500 transition-transform flex-shrink-0 rotate-90'
            : 'w-5 h-5 text-gray-500 transition-transform flex-shrink-0'
        "
      />
    </button>
    <div v-show="isOpen" class="p-4 text-gray-700 leading-relaxed">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  question: string;
}>();

const isOpen = ref(false);
</script>
