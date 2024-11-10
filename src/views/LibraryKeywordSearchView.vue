<script setup lang="ts">
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const libraryStore = useLibraryStore();
const { bookList, libraryNoticeList } = storeToRefs(libraryStore);

/** 新書介紹 */
const libraryNewBookList = computed(() => {
  return bookList.value
    .filter((item) => item.click_count >= 0)
    .sort((a, b) => new Date(b.publish_date).valueOf() - new Date(a.publish_date).valueOf())
    .slice(0, 20);
});

/** 點閱排行 */
const libraryRankingList = computed(() => {
  return bookList.value
    .filter((item) => item.click_count >= 0)
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, 5);
});
</script>

<template>
  <div class="p-4">
    
  </div>
</template>

<style lang="postcss" scoped>
.search-bar {
  @apply flex items-center;
  @apply rounded-lg bg-gray-100 text-grey-400;
  @apply p-2.5;
}

.section-title {
  @apply font-bold text-grey-900;
}

.thumbnail {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
</style>
