import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Ticket, Coupon } from '@/views/CouponView.vue';

export const useCouponStore = defineStore('coupon', () => {
  const ticketList = ref<Ticket[] | []>();
  const couponList = ref<Coupon[] | []>();

  return { ticketList, couponList };
});
