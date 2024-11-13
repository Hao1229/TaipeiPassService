import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import libraryBookListJson from '../../public/mock/library/library_book_list.json';
import librarySearchHotKeywordsJson from '../../public/mock/library/library_search_hot_keywords.json';
import libraryNoticeListJson from '../../public/mock/library/library_notice_list.json';
import libraryRecordsListJson from '../../public/mock/library/library_records_list.json';
import type { LibraryNoticeItem } from '@/views/LibraryNoticeListView.vue';
import type { LibraryBook } from '@/interfaces/library-book.interface';
import type { LibraryRecords } from '@/interfaces/library-records.interface';

export const useLibraryStore = defineStore('library', () => {
  /** 書籍列表 */
  const bookList = ref<LibraryBook[]>(libraryBookListJson.data);

  /** 熱門關鍵字 */
  const hotKeywordList = ref<string[]>(librarySearchHotKeywordsJson.data);

  /** 重要訊息列表 */
  const libraryNoticeList = ref<LibraryNoticeItem[]>(libraryNoticeListJson.data);

  /** 我的紀錄-預約清單 */
  const reservationRecords = computed(() => {
    const storedData = libraryRecordsOrdering.value;
    const data = { ...libraryRecordsListJson.data[0] }; // 創建一個淺拷貝，確保變更可追蹤
    if (storedData) {
      // 將儲存的數據放入第三筆的 data 中
      (data.data[2].data as LibraryRecords[]) = storedData;
    }
    return data;
  });

  const libraryRecordsOrdering = ref<LibraryRecords[]>([]);

  return {
    bookList,
    hotKeywordList,
    libraryNoticeList,
    reservationRecords,
    libraryRecordsOrdering
  };
});
