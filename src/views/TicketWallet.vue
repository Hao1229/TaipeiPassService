<script lang="ts">
export enum TicketType {
  ADMISSION = 'admission',
  COUPON = 'coupon'
}

export enum TicketStatusType {
  NOTREDEEMED = 'not-redeemed',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired'
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseTicket from '@/components/atoms/BaseTicket.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import { useCouponStore } from '@/stores/coupon';
import couponDataJson from '../../public/mock/coupon_data.json';
import ticketWalletJson from '../../public/mock/ticket_wallet.json';

export interface Wallet {
  ticket_type: TicketType;
  data: {
    type: TicketStatusType;
    list: {
      id: string;
      name: string;
      img_url: string;
      date: string;
    }[];
  }[];
}

const route = useRoute();

const walletData = ticketWalletJson.data as Wallet[];

const store = useCouponStore();

const { ticketList, couponList } = storeToRefs(store);

ticketList.value = couponDataJson.data.ticket_list;
couponList.value = couponDataJson.data.coupon_list;

const activeTab = ref(0);

if (route.query.walletTab && route.query.walletTab === '2') {
  activeTab.value = 1;
}

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

const activeTicketStatus = ref(0);

const ticketStatusList = [
  {
    id: 1,
    title: '未兌換'
  },
  {
    id: 2,
    title: '已兌換'
  },
  {
    id: 3,
    title: '已過期'
  }
];

const activeData = computed(() => {
  const data =
    activeTab.value === 0
      ? walletData.find((item) => item.ticket_type === TicketType.ADMISSION)
      : walletData.find((item) => item.ticket_type === TicketType.COUPON);

  if (activeTicketStatus.value === 0) {
    return data?.data.find((item) => item.type === TicketStatusType.NOTREDEEMED);
  } else if (activeTicketStatus.value === 1) {
    return data?.data.find((item) => item.type === TicketStatusType.REDEEMED);
  } else {
    return data?.data.find((item) => item.type === TicketStatusType.EXPIRED);
  }
});
</script>

<template>
  <ServiceTabsView v-model="activeTab" :tab-list="tabList">
    <template #tab0>
      <span>入場券</span>
    </template>
    <template #tab1>
      <div class="pt-[18px]">
        <ServiceTabsView
          v-model="activeTicketStatus"
          :tab-list="ticketStatusList"
          :contentType="true"
        >
          <template #tab0>
            <ul v-if="activeData && activeData.list.length" class="p-4">
              <li v-for="item in activeData?.list" :key="item.id">
                <RouterLink
                  :to="{
                    name: 'coupon-detail',
                    params: { id: item.id },
                    query: { needUse: 'Y', walletTab: '2' }
                  }"
                >
                  <BaseTicket
                    :name="item.name"
                    :img="item.img_url"
                    :date="item.date"
                    :type="activeData.type"
                  />
                </RouterLink>
              </li>
            </ul>
            <div v-else class="flex flex-col justify-center items-center pt-28">
              <img src="@/assets/images/sales-icon.svg" />
              <span class="text-[#5AB4C5] font-semibold text-lg my-5">馬上領取優惠券</span>
              <BaseButton
                :link="true"
                :routeInfo="{ name: 'coupon', query: { tab: '2' } }"
                class="w-44"
              >
                查看優惠
              </BaseButton>
            </div>
          </template>
          <template #tab1>
            <ul v-if="activeData && activeData.list.length" class="p-4">
              <li v-for="item in activeData?.list" :key="item.id">
                <BaseTicket
                  :name="item.name"
                  :img="item.img_url"
                  :date="item.date"
                  :type="activeData.type"
                />
              </li>
            </ul>
            <div v-else class="flex flex-col justify-center items-center pt-28">
              <img src="@/assets/images/sales-icon.svg" />
              <span class="text-[#5AB4C5] font-semibold text-lg my-5">馬上領取優惠券</span>
              <BaseButton
                :link="true"
                :routeInfo="{ name: 'coupon', query: { tab: '2' } }"
                class="w-44"
              >
                查看優惠
              </BaseButton>
            </div>
          </template>
          <template #tab2>
            <ul v-if="activeData && activeData.list.length" class="p-4">
              <li v-for="item in activeData?.list" :key="item.id">
                <BaseTicket
                  :name="item.name"
                  :img="item.img_url"
                  :date="item.date"
                  :type="activeData.type"
                />
              </li>
            </ul>
            <div v-else class="flex flex-col justify-center items-center pt-28">
              <img src="@/assets/images/sales-icon.svg" />
              <span class="text-[#5AB4C5] font-semibold text-lg my-5">無優惠券過期失效</span>
            </div>
          </template>
        </ServiceTabsView>
      </div>
    </template>
  </ServiceTabsView>
</template>
