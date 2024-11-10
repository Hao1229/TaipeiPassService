import { ref } from 'vue';
import { defineStore } from 'pinia';
import libraryBookListJson from '../../public/mock/library/library_book_list.json';
import librarySearchHotKeywordsJson from '../../public/mock/library/library_search_hot_keywords.json';
import libraryNoticeListJson from '../../public/mock/library/library_notice_list.json';
import type { LibraryNoticeItem } from '@/views/LibraryNoticeListView.vue';
import type { LibraryBook } from '@/interfaces/library-book.interface';

export const useLibraryStore = defineStore('library', () => {
  /** 書籍列表 */
  const bookList = ref<LibraryBook[]>(libraryBookListJson.data);

  /** 熱門關鍵字 */
  const hotKeywordList = ref<string[]>(librarySearchHotKeywordsJson.data);

  /** 重要訊息列表 */
  const libraryNoticeList = ref<LibraryNoticeItem[]>(libraryNoticeListJson.data);

  return {
    bookList,
    hotKeywordList,
    libraryNoticeList
  };
});
