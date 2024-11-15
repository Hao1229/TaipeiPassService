import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import feePaymentJson from '../../public/mock/fee-payment/fee_payment_list.json';
import billListJson from '../../public/mock/fee-payment/bill_list.json';
import type { FeePayment } from '@/interfaces/fee-payment.interface';
import type { Bill } from '@/interfaces/bill.interface';

export const useFeePaymentStore = defineStore('fee-payment', () => {
  /** 規費列表 */
  const paymentList = ref<{ name: string; icon: string; data: FeePayment[] }[]>(
    feePaymentJson.data
  );

  /** 帳單列表 */
  const billList = ref<Bill[]>(billListJson.data);

  return {
    paymentList,
    billList
  };
});
