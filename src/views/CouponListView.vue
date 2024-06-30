<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router';
import BaseInput from '@/components/atoms/BaseInput.vue';

const route = useRoute();
</script>

<template>
  <div class="py-2 px-4">
    <div class="flex justify-between">
      <RouterLink
        :to="{
          name: 'coupon',
          query: {
            tab: route.query?.tab
          }
        }"
      >
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </RouterLink>
      <h1 v-if="route.query?.isList === 'Y'" class="font-bold text-lg">
        {{ route.query?.tab === '1' ? '入場券' : '優惠券' }}列表
      </h1>
      <h1 v-else-if="route.query?.isHot === 'Y'" class="font-bold text-lg">熱門場館</h1>
      <h1 v-else-if="route.query?.isFilter === 'Y'" class="font-bold text-lg">優惠券篩選</h1>
      <h1 v-else class="font-bold text-lg">
        {{ route.query?.tab === '1' ? '入場券' : '優惠券' }}搜尋
      </h1>
      <div />
    </div>
    <section class="flex items-center mt-3">
      <BaseInput
        :placeholder="route.query.tab === '1' ? '搜尋票券或場館名稱' : '輸入店家名稱'"
        class="flex-grow"
      />
      <button :to="{ name: 'coupon-list' }" class="search-button">
        <img src="@/assets/images/search-icon.svg" alt="搜尋" />
      </button>
      <button :to="{ name: 'coupon-list' }" class="search-button ml-2">
        <img src="@/assets/images/icon-filter-white.svg" alt="搜尋" />
      </button>
    </section>
  </div>
</template>
