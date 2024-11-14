import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import feePaymentJson from '../../public/mock/fee-payment/fee_payment_list.json';
import type { FeePayment } from '@/interfaces/fee-payment.interface';

export const useFeePaymentStore = defineStore('fee-payment', () => {
  /** 規費列表 */
  const paymentList = ref<{ name: string; icon: string; data: FeePayment[] }[]>(
    feePaymentJson.data
  );

  return {
    paymentList
  };
});
