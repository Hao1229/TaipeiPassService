<script setup lang="ts">
import { computed, ref } from 'vue';
import counterListJson from '../../public/mock/counter_list.json';
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

export interface Counter {
  id: string;
  name: string;
  icon: string;
  list?: CounterItem[];
}

export interface CounterItem {
  id: string;
  name: string;
  is_regularly_used: boolean;
  info: {
    address: string;
    tel: string;
    fax: string;
  };
  counters?: {
    id: string;
    name: string;
    current_number: string;
    waiting_people: number;
  }[];
}

const counterStore = useCounterStore();
const { counterList, regularlyUsedList } = storeToRefs(counterStore);

const counterId = (subId: string) => {
  return counterList.value.find((item) => item.list?.find((subItem) => subItem.id === subId))!.id;
};
</script>

<template>
  <div class="px-5 py-8 bg-white border-b-2 border-grey-200" v-if="regularlyUsedList.length">
    <div class="flex justify-between">
      <h5 class="font-bold mb-3">常用地點</h5>
      <RouterLink
        :to="{
          name: 'counter-calling-edit'
        }"
      >
        變更
      </RouterLink>
    </div>
    <div class="w-full flex flex-col">
      <RouterLink
        :to="{
          name: 'counter-calling-detail',
          params: { id: counterId(counterItem.id) },
          query: {
            subId: counterItem.id
          }
        }"
        class="regularly-used-wrapper"
        v-for="(counterItem, index) in regularlyUsedList"
        :key="index"
      >
        <span>{{ counterItem.name }}</span>
      </RouterLink>
    </div>
  </div>
  <div class="h-screen px-5 py-8 bg-grey-50">
    <h5 class="font-bold mb-3">櫃檯等待人數查詢</h5>
    <div class="w-full flex flex-col">
      <RouterLink
        :to="{
          name: 'counter-calling-detail',
          params: { id: counter.id }
        }"
        class="link-wrapper"
        v-for="(counter, index) in counterList"
        :key="index"
      >
        <img :src="counter.icon" class="icon" :alt="counter.name" />
        <span>{{ counter.name }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.link-wrapper {
  @apply relative p-5 mb-3 bg-white rounded-md shadow-md;
  @apply flex items-center;
  @apply after:content-[''] after:w-6 after:h-6;
  @apply after:bg-[url('@/assets/images/down-icon.svg')] after:bg-cover after:bg-no-repeat after:-rotate-90;
  @apply after:block after:absolute after:top-1/2 after:-translate-y-1/2 after:right-2;

  .icon {
    @apply w-10 h-10 bg-primary-100 rounded-full mr-3 p-2;
  }
}

.regularly-used-wrapper {
  @apply relative py-5 mb-3 border-b border-grey-50;
  @apply flex items-center;
  @apply after:content-[''] after:w-6 after:h-6;
  @apply after:bg-[url('@/assets/images/down-icon.svg')] after:bg-cover after:bg-no-repeat after:-rotate-90;
  @apply after:block after:absolute after:top-1/2 after:-translate-y-1/2 after:right-2;

  .icon {
    @apply w-10 h-10 bg-primary-100 rounded-full mr-3 p-2;
  }
}
</style>
