<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-4 space-y-4">
      <div
        v-for="entry in unreadNews"
        :key="entry.version"
        class="bg-white rounded-lg shadow-sm p-6"
      >
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold text-secondary-600">{{ entry.title }}</h2>
          <span class="text-sm text-gray-400">{{ entry.date }}</span>
        </div>
        <p class="text-gray-600">{{ entry.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { news, lastSeenVersion, markAsSeen } = useNews();

const previousLastSeen = lastSeenVersion.value;
const unreadNews = news
  .filter((n) => n.version > previousLastSeen)
  .sort((a, b) => b.date.localeCompare(a.date));

definePageMeta({
  pageTitle: 'Nouveautés',
});

onMounted(() => {
  markAsSeen();
});
</script>
