<script setup lang="ts">
import { ref } from 'vue';
import counterListJson from '../../public/mock/counter_list.json';

const counterList = ref<
  {
    id: string;
    name: string;
    icon: string;
  }[]
>(counterListJson.data);
</script>

<template>
  <div class="px-5 py-8 bg-grey-50">
    <h5 class="font-bold mb-3">櫃檯等待人數查詢</h5>
    <div class="w-full flex flex-col">
      <RouterLink
        to="/qna"
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

<style lang="postcss">
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
</style>
