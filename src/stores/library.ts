import { ref } from 'vue';
import { defineStore } from 'pinia';
import libraryRankingListJson from '../../public/mock/library/library_ranking_list.json';
import libraryNoticeListJson from '../../public/mock/library/library_notice_list.json';
import type { LibraryNoticeItem } from '@/views/LibraryNoticeListView.vue';
import type { LibraryBook } from '@/interfaces/library-book.interface';

export const useLibraryStore = defineStore('library', () => {
  /** 書籍列表 */
  const bookList = ref<LibraryBook[]>(libraryRankingListJson.data);

  /** 重要訊息列表 */
  const libraryNoticeList = ref<LibraryNoticeItem[]>(libraryNoticeListJson.data);

  return {
    bookList,
    libraryNoticeList
  };
});
