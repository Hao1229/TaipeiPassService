<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
import { useCouponStore } from '@/stores/coupon';
import { TicketStatusType } from '@/views/TicketWallet.vue';

const router = useRouter();
const route = useRoute();

const store = useCouponStore();

const { walletData } = storeToRefs(store);

const onBackButtonClick = () => {
  router.push({
    name: 'ticket-wallet'
  });
};

const walletDataMap = computed(() => {
  const flatData =
    walletData.value
      ?.reduce(
        (
          acc: {
            type: TicketStatusType;
            list: {
              id: string;
              name: string;
              img_url: string;
              date: string;
              qrcode?: string;
            }[];
          }[],
          current
        ) => {
          return [...acc, ...current.data];
        },
        []
      )
      .reduce(
        (
          acc: {
            id: string;
            name: string;
            img_url: string;
            date: string;
            qrcode?: string;
          }[],
          current
        ) => {
          return [...acc, ...current.list];
        },
        []
      ) ?? [];

  return new Map(
    flatData.map(
      (item: { id: string; name: string; img_url: string; date: string; qrcode?: string }) => [
        item.id,
        item
      ]
    )
  );
});

const activeData = computed(() => walletDataMap.value.get(route.params.id as string));
</script>

<template>
  <div v-if="activeData" class="min-h-screen flex flex-col">
    <div class="h-14 px-4 py-3 flex justify-center items-center relative">
      <button @click="onBackButtonClick" class="absolute top-1/2 -translate-y-1/2 left-4">
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </button>
      <h1 class="font-semibold text-grey-700">兌換</h1>
    </div>
    <div class="bg-grey-50 py-3 px-4">
      <p class="font-semibold text-grey-800">{{ activeData.name }}</p>
      <p class="text-sm text-grey-400">{{ activeData.date }}</p>
    </div>
    <div class="bg-[#5AB4C5] grow flex flex-col justify-center items-center">
      <p class="font-semibold text-white mb-8">請出示此QRCode兌換</p>
      <div class="bg-white rounded-3xl p-6">
        <QrcodeVue
          v-if="activeData.qrcode"
          :value="activeData.qrcode"
          level="M"
          render-as="svg"
          :size="186"
        />
      </div>
    </div>
  </div>
</template>
