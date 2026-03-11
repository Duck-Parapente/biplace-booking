<template>
  <div
    :id="id"
    v-show="isItemVisible(id)"
    data-faq-item
    class="border-b border-gray-200 scroll-mt-4"
  >
    <button
      class="w-full py-5 px-6 text-left flex justify-between items-center hover:bg-gray-300 transition-colors bg-gray-200 cursor-pointer"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3 pr-4">
        <h3 class="text-base font-semibold text-gray-900">{{ question }}</h3>
        <span
          class="text-gray-400 hover:text-gray-600 transition-colors p-2 -m-1 flex-shrink-0 rounded hover:bg-gray-100"
          title="Copier le lien"
          @click.stop="copyLink"
        >
          <svg
            v-if="!copied"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      </div>
      <IconChevronRight
        :class="
          isOpen
            ? 'w-5 h-5 text-gray-500 transition-transform flex-shrink-0 rotate-90'
            : 'w-5 h-5 text-gray-500 transition-transform flex-shrink-0'
        "
      />
    </button>
    <div v-show="isOpen" class="px-6 pt-4 pb-8 text-gray-700 leading-relaxed">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
  question: string;
  isInitiallyOpen: (id: string) => boolean;
  isItemVisible: (id: string) => boolean;
}>();

const isOpen = ref(props.isInitiallyOpen(props.id));
const copied = ref(false);

watch(isOpen, (open) => {
  if (open) {
    history.replaceState(null, '', `#${props.id}`);
    return;
  }

  if (location.hash === `#${props.id}`) {
    history.replaceState(null, '', location.pathname + location.search);
    return;
  }
});

function copyLink() {
  const url = `${window.location.origin}/faq#${props.id}`;
  navigator.clipboard.writeText(url);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>
