<script setup lang="ts">
import { computed } from 'vue';
import BaseCardlabel from '@/components/atoms/BaseCardlabel.vue';
import { CardLabelType } from '@/components/atoms/BaseCardlabel.vue';

const textContentMaxWidth = computed(() => (window ? window.innerWidth - 32 : '0'));
</script>

<template>
  <div
    class="hot-list-item-image-block"
    :style="{
      'background-image': `url(
                    'https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  )`
    }"
  >
    <p class="text-white">| 臺北市立美術館 | 入場門票</p>
    <BaseCardlabel
      title="會員獨享"
      :label-type="CardLabelType.VIP"
      class="absolute top-3 -right-2"
    />
    <BaseCardlabel
      title="市民優惠"
      :label-type="CardLabelType.DISCOUNT"
      class="absolute top-10 -right-2"
    />
  </div>
  <div class="p-2 text-sm" :style="{ maxWidth: `${textContentMaxWidth}px` }">
    <p class="text-ellipsis overflow-hidden whitespace-nowrap">
      僅限開館日每日0:00-17:00開放線上購票僅限開館日每日0:00-17:00開放線上購票僅限開館日每日0:00-17:00開放線上購票
    </p>
    <p class="text-primary-500 font-bold">NT$ 15起</p>
  </div>
</template>

<style lang="postcss">
.hot-list-item-image-block {
  @apply relative;
  @apply bg-cover bg-no-repeat bg-center;
  @apply h-32 rounded-t-md;
  @apply flex items-end;
  @apply px-4 py-2;
  @apply font-bold;
}
</style>
