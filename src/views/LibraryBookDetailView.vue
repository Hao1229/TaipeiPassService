<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import LibrarySelectDialog from '@/components/molecules/LibrarySelectDialog.vue';
import { useLibraryStore } from '@/stores/library';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();

const libraryStore = useLibraryStore();
const { bookList } = storeToRefs(libraryStore);

const bookItem = computed(() => bookList.value.find((item) => item.id === route.params.id)!);

const seriesModel = ref<string[]>([]);

/** 預約冊數上限 */
const reservationLimit = ref(7);

/** 已選擇的取書館 id */
const selectedLibraryId = ref('');

/** 該藏書取書館選項 */
const libraryOptions = computed(() => {
  return bookItem.value.libraries.map((item) => ({
    label: item.name,
    value: item.id
  }));
});

const isDialogOpen = ref(false);
const isLibrarySelectDialogOpen = ref(false);

const checkLimit = (id: string) => {
  // 檢查當前選中的數量是否超出限制
  if (seriesModel.value.length >= reservationLimit.value && !seriesModel.value.includes(id)) {
    isDialogOpen.value = true; // 如果超出限制，打開對話框
  } else {
    // 如果未超出限制，繼續勾選
    const index = seriesModel.value.indexOf(id);
    if (index === -1) {
      seriesModel.value.push(id); // 添加勾選
    } else {
      seriesModel.value.splice(index, 1); // 取消勾選
    }
  }
};

/**
 * 點擊預約
 */
const onSubmitClick = async () => {
  console.log(seriesModel.value);
};
</script>

<template>
  <div class="h-screen px-5 py-8 overflow-y-auto">
    <!-- 書籍介紹 -->
    <div class="grid grid-cols-3 gap-4">
      <div class="thumbnail mb-2">
        <img :src="bookItem.thumbnail" v-if="bookItem.thumbnail" alt="thumbnail" />
        <div v-else class="bg-grey-100 w-full h-full"></div>
      </div>
      <p class="col-span-2">{{ bookItem.book_name }}</p>
    </div>
    <p>著者：{{ bookItem.author }}</p>
    <p>出版項：{{ bookItem.publisher }}</p>
    <p>主題：{{ bookItem.subject }}</p>
    <p>ISBN：{{ bookItem.isbn }}</p>
    <hr class="my-4" />
    <!-- 集數預約 -->
    <div class="mb-40">
      <template v-if="bookItem.series.length">
        <div
          v-for="(seriesItem, index) in bookItem.series.slice().reverse()"
          :key="index"
          class="flex items-center justify-between mb-4"
        >
          <label
            :for="seriesItem.id"
            :class="seriesModel.includes(seriesItem.id) ? 'text-primary-500' : ''"
            class="flex-grow"
            @click.prevent="checkLimit(seriesItem.id)"
          >
            {{ seriesItem.series＿name }}
            <span v-if="bookItem.series.length > 1">;</span>
            預約等待人數：{{ seriesItem.waiting_people }}
          </label>
          <div class="ml-auto flex items-center flex-shrink-0">
            <span class="tag mr-2 whitespace-nowrap" v-if="seriesItem.is_hot">熱門館藏</span>
            <BaseCheckbox
              :option="{
                label: '',
                value: seriesItem.id
              }"
              v-if="bookItem.series.length > 1"
              v-model="seriesModel"
              @click.prevent="checkLimit(seriesItem.id)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <p>本館藏不提供預約</p>
      </template>
    </div>
    <!-- 預約按鈕 -->
    <div
      class="bg-white fixed bottom-0 left-0 right-0 p-4 shadow-[0_-5px_10px_-8px_rgba(0,0,0,0.3)]"
    >
      <div>
        <p class="font-bold mb-2">取書館</p>
        <BaseSelect
          v-model="selectedLibraryId"
          :selectId="bookItem.id"
          :options="libraryOptions"
          :customClass="'bg-white pr-9 pointer-events-none'"
          default-selected="請選擇取書館"
          class="w-full mb-2"
          @click.stop="isLibrarySelectDialogOpen = true"
        />
      </div>
      <BaseButton class="w-full" :disabled="!selectedLibraryId" @click="onSubmitClick()">
        預約
      </BaseButton>
    </div>

    <LibrarySelectDialog
      v-model="isLibrarySelectDialogOpen"
      :libraries="bookItem.libraries"
      @confirm="(inputValue: string) => (selectedLibraryId = inputValue)"
    />

    <BaseDialog
      v-model="isDialogOpen"
      title="提醒"
      :content="`您的已預約及預約冊數，已達上限${reservationLimit}冊`"
      :isAlert="true"
      positiveText="關閉"
      @onPositiveClick="() => (isDialogOpen = false)"
    />
  </div>
</template>

<style lang="postcss" scoped>
.thumbnail {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.tag {
  @apply bg-[#65A91E] text-white text-sm px-2 py-1 rounded-lg;
}
</style>
