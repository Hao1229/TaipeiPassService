import type { BookSeries, Library, LibraryBook } from './library-book.interface';

/**
 * 我的紀錄
 */
export interface LibraryRecords extends LibraryBook {
  record_id: string;
  /** 取書館 */
  selected_library: Library;
  /** 預約排序 */
  reservation_order?: number;
  /** 紀錄日期 */
  date: string;
}
