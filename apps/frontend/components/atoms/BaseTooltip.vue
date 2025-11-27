<template>
  <span class="relative inline-flex items-center ml-1">
    <button
      type="button"
      @click="isVisible = !isVisible"
      @mouseenter="isVisible = true"
      @mouseleave="isVisible = false"
      class="w-4 h-4 text-xs leading-4 text-center bg-gray-400 text-white rounded-full cursor-pointer hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      i
    </button>
    <div
      v-if="isVisible"
      @click.stop
      class="absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-800 rounded shadow-lg left-0 sm:-translate-x-1/2 sm:left-1/2"
    >
      <slot></slot>
    </div>
  </span>
</template>

<script setup lang="ts">
const isVisible = ref(false);

// Close tooltip when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (isVisible.value && !target.closest('.relative.inline-block')) {
      isVisible.value = false;
    }
  };

  document.addEventListener('click', handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>
