<script setup lang="ts">
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';

const counterStore = useLibraryStore();
const { libraryNoticeList } = storeToRefs(counterStore);
</script>

<template>
  <!-- 關鍵字搜尋 -->
  <div class="p-4">
    <a href="" class="search-bar">
      <img
        src="@/assets/images/search-icon-dark.svg"
        width="24"
        class="mr-2"
        alt="search-icon-dark"
      />
      <span>關鍵字搜尋</span>
    </a>
  </div>
  <!-- 新書介紹 -->
  <div class="p-4">
    <h5 class="section-title">新書介紹</h5>
  </div>
  <!-- 點閱排行 -->
  <div class="p-4">
    <div class="flex items-center">
      <h5 class="section-title">點閱排行</h5>
      <a href="" class="ml-auto text-primary-500">更多</a>
    </div>
  </div>
  <!-- 重要訊息 -->
  <div class="p-4">
    <div class="flex items-center">
      <h5 class="section-title">重要訊息</h5>
      <router-link :to="{ name: 'library-notice-list' }" class="ml-auto text-primary-500">
        更多
      </router-link>
    </div>
    <div v-if="libraryNoticeList.length">
      <div v-for="(item, index) in libraryNoticeList.slice(0, 3)" :key="index">
        <template v-if="item.is_open_outer_link">
          <a :href="item.outer_link" target="_blank" rel="noopener noreferrer">
            <div class="py-4 border-b border-grey-200">
              <h5 class="clamp-2-lines mb-1">{{ item.title }}</h5>
              <p class="text-grey-400 text-sm">
                {{ item.date }}
              </p>
            </div>
          </a>
        </template>
        <template v-else>
          <router-link
            :to="{ name: 'library-notice-detail', params: { id: item.id } }"
            class="item"
          >
            <div class="py-4 border-b border-grey-200">
              <h5 class="clamp-2-lines mb-1">{{ item.title }}</h5>
              <p class="text-grey-400 text-sm">
                {{ item.date }}
              </p>
            </div>
          </router-link>
        </template>
      </div>
    </div>
    <div v-else class="flex items-center justify-center my-4">
      <div class="text-grey-400">
        <img src="@/assets/images/info-icon-grey.svg" class="mx-auto" alt="info-icon" />
        <p class="text-center mt-2">系統忙碌中，無法顯示資訊，請稍後再試</p>
      </div>
    </div>
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

.clamp-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制顯示兩行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
