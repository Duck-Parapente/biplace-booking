<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-4 space-y-4">
      <div
        v-for="entry in sortedNews"
        :key="entry.version"
        :class="[
          'rounded-lg shadow-sm p-6',
          isUnread(entry) ? 'bg-white' : 'bg-gray-100 opacity-60',
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span v-if="isUnread(entry)" class="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            <h2 class="text-lg font-semibold text-secondary-600">{{ entry.title }}</h2>
          </div>
          <span class="text-sm text-gray-400">{{ formatDate(entry.date) }}</span>
        </div>
        <p class="text-gray-600">{{ entry.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/composables/useDateHelpers';

const { news, lastSeenVersion, markAsSeen } = useNews();

const previousLastSeen = lastSeenVersion.value;
const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));
const isUnread = (entry: (typeof news)[number]) => entry.version > previousLastSeen;

definePageMeta({
  pageTitle: 'Nouveautés',
});

onMounted(() => {
  markAsSeen();
});
</script>
