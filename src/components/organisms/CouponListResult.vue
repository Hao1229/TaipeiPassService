<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCouponStore } from '@/stores/coupon';
import CouponResultItem from '@/components/molecules/CouponResultItem.vue';

const route = useRoute();
const store = useCouponStore();
const { ticketList, couponList } = storeToRefs(store);
const activeList = computed(() => (route.query.tab === '1' ? ticketList.value : couponList.value));
</script>

<template>
  <ul class="grid grid-cols-1 gap-y-3">
    <li v-for="item in activeList" :key="item.id" class="border-b border-b-gray-300 pb-2">
      <CouponResultItem :item="item" />
    </li>
  </ul>
</template>
