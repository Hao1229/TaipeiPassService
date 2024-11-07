import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import libraryNoticeListJson from '../../public/mock/library/library_notice_list.json';
import type { LibraryNoticeItem } from '@/views/LibraryNoticeListView.vue';

export const useLibraryStore = defineStore('library', () => {
  /** 重要訊息列表 */
  const libraryNoticeList = ref<LibraryNoticeItem[]>(libraryNoticeListJson.data);

  return {
    libraryNoticeList
  };
});
