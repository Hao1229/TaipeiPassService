<script setup lang="ts">
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import type { LibraryBook } from '@/interfaces/library-book.interface';
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import type { LibraryRecords } from '@/interfaces/library-records.interface';

const libraryStore = useLibraryStore();
const { reservationRecords, libraryRecordsOrdering } = storeToRefs(libraryStore);

/** 清單選項 */
const listOptions = ref([
  {
    label: '預約清單',
    value: 'reservation-list'
  },
  {
    label: '預約未取紀錄',
    value: 'reservation-not-take-records'
  },
  {
    label: '借閱中',
    value: 'borrowing-list'
  },
  {
    label: '借閱歷史紀錄',
    value: 'borrow-history-list'
  }
]);

const selectedListId = ref('reservation-list');

const expandList = ref<string[]>([]);
const expandListSet = computed(() => new Set(expandList.value.map((name) => name)));

const isMapDialogOpen = ref(false);
const isCancelDialogOpen = ref(false);

const onExpandClick = (name: string) => {
  if (expandListSet.value.has(name)) {
    const index = expandList.value.findIndex((el) => el === name);
    expandList.value.splice(index, 1);
  } else {
    expandList.value.push(name);
  }
};

const onMapOpenClick = (subItem?: LibraryRecords) => {
  useConnectionMessage('launch_map', subItem?.selected_library.address);
};

const selectedSubItem = ref<LibraryRecords>();

/** 取消預約 */
const cancelReservation = (subItem?: LibraryRecords) => {
  libraryRecordsOrdering.value = libraryRecordsOrdering.value.filter(
    (item) => item.record_id !== subItem!.record_id
  );

  localStorage.setItem('libraryRecordsOrdering', JSON.stringify(libraryRecordsOrdering.value));
};

onMounted(() => {
  /**
   * 以下為展示用假資料，真正實作後可刪除
   */
  // 從 localStorage 中獲取現有的 libraryRecordsOrdering
  const existingRecords = localStorage.getItem('libraryRecordsOrdering');
  // 檢查是否已有值
  if (existingRecords) {
    // 將現有資料解析為陣列
    const recordsArray = JSON.parse(existingRecords);
    libraryRecordsOrdering.value = recordsArray;
  }
});
</script>

<template>
  <div class="p-4">
    <BaseSelect
      v-model="selectedListId"
      :selectId="'reservation-list'"
      :options="listOptions"
      :customClass="'bg-white pr-9'"
      class="w-full mb-2"
    />
    <template v-if="selectedListId === 'reservation-list'">
      <ul>
        <li class="px-4 py-2" v-for="item in reservationRecords.data" :key="item.name">
          <button class="w-full flex justify-between items-center mb-5">
            <div
              class="flex items-end"
              :class="{
                'font-bold': expandListSet.has(item.name)
              }"
            >
              {{ item.name }}({{ item.data.length }})
            </div>
            <img
              src="@/assets/images/down-icon.svg"
              class="transition-transform"
              :class="{
                'rotate-180': expandListSet.has(item.name)
              }"
              @click="onExpandClick(item.name)"
            />
          </button>
          <div
            class="grid grid-rows-[0fr] transition-all"
            :class="{
              'grid-rows-[1fr]': expandListSet.has(item.name)
            }"
          >
            <ul class="overflow-hidden">
              <li v-for="(subItem, index) in item.data" :key="index">
                <div class="flex pl-[3px]">
                  <div class="w-0.5 bg-primary-500 mr-4 self-stretch"></div>
                  <ul>
                    <li class="mb-3">
                      <router-link
                        :to="{ name: 'library-book-detail', params: { id: subItem.id } }"
                      >
                        <p class="option-title font-bold">
                          <span class="line-clamp-1">{{ subItem.book_name }}</span>
                        </p>
                        <p class="line-clamp-1">索書號：{{ subItem.call_number }}</p>
                        <p class="line-clamp-1">
                          取書館：<a
                            :href="subItem.selected_library.address"
                            class="col-span-8 underline"
                            @click.prevent="
                              isMapDialogOpen = true;
                              selectedSubItem = subItem;
                            "
                          >
                            {{ subItem.selected_library.name }}
                          </a>
                        </p>
                        <p v-if="item.name !== '排序中'">調出日期：{{ subItem.date }}</p>
                        <template v-if="item.name === '排序中'">
                          <p>預約排序：{{ subItem.reservation_order }}</p>
                          <a
                            href=""
                            class="underline text-primary-500"
                            @click.prevent="
                              isCancelDialogOpen = true;
                              selectedSubItem = subItem;
                            "
                            >取消預約</a
                          >
                        </template>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <BaseDialog
        v-model="isMapDialogOpen"
        title="是否要開啟 Google Map"
        :content="`地點：${selectedSubItem?.selected_library.name}`"
        :isAlert="true"
        positiveText="開啟"
        negativeText="取消"
        @onNegativeClick="selectedSubItem = undefined"
        @onPositiveClick="onMapOpenClick(selectedSubItem)"
      />
      <BaseDialog
        v-model="isCancelDialogOpen"
        title="取消預約"
        :content="`題名：${selectedSubItem?.book_name}\n索書號：${selectedSubItem?.call_number}`"
        :isAlert="true"
        negativeText="我再想想"
        positiveText="取消預約"
        @onNegativeClick="
          selectedSubItem = undefined;
          isCancelDialogOpen = false;
        "
        @onPositiveClick="cancelReservation(selectedSubItem)"
      />
    </template>
    <template v-else-if="selectedListId === 'reservation-not-take-records'"> 2 </template>
    <template v-else-if="selectedListId === 'borrowing-list'"> 3 </template>
    <template v-else-if="selectedListId === 'borrow-history-list'"> 4 </template>
  </div>
</template>

<style lang="postcss" scoped>
.option-title {
  @apply relative;
  @apply before:content-[''];
  @apply before:w-1.5 before:h-0.5;
  @apply before:bg-primary-500;
  @apply before:inline-block;
  @apply before:absolute before:-left-3.5 before:top-1/2 before:-translate-y-1/2;
}
</style>
