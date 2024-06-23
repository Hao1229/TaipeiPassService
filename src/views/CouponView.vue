<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import BaseInput from '@/components/atoms/BaseInput.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import HotList from '@/components/organisms/HotList.vue';

const activeTab = ref(0);

const tabList = [
  {
    id: 1,
    title: '入場券'
  },
  {
    id: 2,
    title: '優惠券'
  }
];
</script>

<template>
  <div>
    <ServiceTabsView v-model="activeTab" :tab-list="tabList">
      <template #tab0>
        <section class="flex items-center p-4">
          <RouterLink :to="{ name: 'coupon-list' }" class="flex-grow">
            <BaseInput placeholder="搜尋票券或場館名稱" readonly class="w-full" />
          </RouterLink>
          <RouterLink :to="{ name: 'coupon-list' }" class="search-button">
            <img src="@/assets/images/search-icon.svg" alt="搜尋" />
          </RouterLink>
          <RouterLink :to="{ name: 'coupon-list' }" class="search-button ml-2">
            <img src="@/assets/images/icon-filter-white.svg" alt="搜尋" />
          </RouterLink>
        </section>
        <section class="px-4 grid grid-cols-2 gap-x-3">
          <RouterLink :to="{ name: 'coupon-list' }" class="ticket-hot-button">
            <span class="text-lg font-bold">人氣特展</span>
            <br />
            <span>廣受好評的票券</span>
            <img src="@/assets/images/award-icon.svg" />
          </RouterLink>
          <RouterLink :to="{ name: 'coupon-list' }" class="ticket-hot-button">
            <span class="text-lg font-bold">熱門場館</span>
            <br />
            <span>熱門景點</span>
            <img src="@/assets/images/gondola-icon.svg" />
          </RouterLink>
        </section>
        <section class="px-4 mt-5">
          <HotList />
        </section>
      </template>
      <template #tab1>
        <section class="flex items-center p-4">
          <RouterLink :to="{ name: 'coupon-list' }" class="flex-grow">
            <BaseInput placeholder="輸入店家名稱" readonly class="w-full" />
          </RouterLink>
          <RouterLink :to="{ name: 'coupon-list' }" class="search-button">
            <img src="@/assets/images/search-icon.svg" alt="搜尋" />
          </RouterLink>
          <RouterLink :to="{ name: 'coupon-list' }" class="search-button ml-2">
            <img src="@/assets/images/icon-filter-white.svg" alt="搜尋" />
          </RouterLink>
        </section>
        <section class="px-4 mt-5">
          <HotList />
        </section>
      </template>
    </ServiceTabsView>
  </div>
</template>

<style lang="postcss">
.ticket-hot-button {
  @apply rounded-md shadow-md relative;
  @apply bg-primary-100;
  @apply p-4;

  & > img {
    @apply absolute top-0 right-2;
  }
}
</style>
