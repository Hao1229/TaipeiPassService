<script setup lang="ts">
import FindPlace, { type Place } from '@/components/molecules/FindPlace.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import type { Spot } from '@/views/SurroundingServiceView.vue';

const props = defineProps<{
  selectedSearchData: Place;
  filteredSpotList: Spot[];
}>();
const emit = defineEmits(['update:isExpandList']);

onMounted(() => {});
</script>

<template>
  <div class="pb-8 h-screen flex flex-col">
    <!-- title -->
    <div class="p-5">
      <div class="flex items-center mb-2">
        <span class="font-bold text-xl mr-2">{{ selectedSearchData.name }}</span>
        <div class="text-primary-500 border border-primary-500 rounded-full px-2">
          {{ filteredSpotList.length }}筆結果
        </div>
      </div>
      <p class="text-grey-500 text-sm">{{ selectedSearchData.agency }}</p>
    </div>
    <!-- list -->
    <div v-for="spot in filteredSpotList" :key="spot.id" class="mx-5 py-4 border-b border-grey-200">
      <p class="underline font-bold mb-2">{{ spot.name }}</p>
      <div class="flex">
        <img src="@/assets/images/icon-geo.svg" alt="" />
        <span>{{ spot.address }}</span>
      </div>
    </div>
    <div class="flex-1 flex justify-center items-center">
      <div class="text-center">
        <img src="@/assets/images/img-maplost.svg" class="mx-auto mb-2" alt="" />
        <p class="text-primary-500 font-bold text-xl mb-2">無符合搜尋結果</p>
        <p class="text-grey-500 text-sm">請試試其篩選分類</p>
      </div>
    </div>

    <!-- 浮動按鈕 -->
    <BaseButton
      shape="rounded"
      class="fixed bottom-10 left-[50%] translate-x-[-50%] h-[56px]"
      @click="emit('update:isExpandList', false)"
    >
      <div class="flex px-2">
        <img src="@/assets/images/icon-map.svg" class="mr-2" width="24" alt="" />
        <span>地圖</span>
      </div>
    </BaseButton>
    <BaseButton
      shape="rounded"
      v-if="filteredSpotList.length"
      class="fixed bottom-10 right-6 w-[56px] h-[56px]"
    >
      TOP
    </BaseButton>
  </div>
</template>

<style lang="postcss" scoped>
.rounded-button {
  @apply rounded-full;
  @apply bg-primary-500;
  @apply text-white;
  @apply px-5 py-4;
  @apply flex;
  @apply justify-center;
  @apply items-center;
}
</style>
