import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Ticket, Coupon, HotSpot } from '@/views/CouponView.vue';
import type { Wallet } from '@/views/TicketWallet.vue';

export const useCouponStore = defineStore('coupon', () => {
  const ticketList = ref<Ticket[] | []>();
  const couponList = ref<Coupon[] | []>();
  const hotSpotList = ref<HotSpot[] | []>();
  const walletData = ref<Wallet>();

  const ticketListMap = computed(() => new Map(ticketList.value?.map((item) => [item.id, item])));
  const couponListMap = computed(() => new Map(couponList.value?.map((item) => [item.id, item])));
  const hotSpotListMap = computed(() => new Map(hotSpotList.value?.map((item) => [item.id, item])));

  return {
    ticketList,
    couponList,
    hotSpotList,
    walletData,
    ticketListMap,
    couponListMap,
    hotSpotListMap
  };
});
