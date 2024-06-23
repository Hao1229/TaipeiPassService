<script setup lang="ts">
import { RouterLink } from 'vue-router';
import HotListItem from '@/components/molecules/HotListItem.vue';
</script>

<template>
  <div class="flex justify-between items-end">
    <h3 class="text-lg font-bold">熱門</h3>
    <div class="flex">
      <RouterLink :to="{ name: 'coupon-list' }" class="text-sm"> 更多 </RouterLink>
      <img src="@/assets/images/down-icon.svg" alt="更多" class="w-5 -rotate-90 ml-1" />
    </div>
  </div>
  <ul class="pt-2 pb-12 grid grid-cols-1 gap-y-3">
    <li v-for="item in 5" :key="item" class="border border-gray-400 rounded-md">
      <HotListItem />
    </li>
  </ul>
</template>
