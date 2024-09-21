<script lang="ts">
export enum TicketType {
  ADMISSION = 'admission',
  COUPON = 'coupon'
}

export enum TicketStatusType {
  NOTREDEEMED = 'not-redeemed',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  MYORDER = 'my-order',
  FINISHED = 'finished'
}
</script>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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
      qrcode?: string;
    }[];
  }[];
}

const route = useRoute();

const store = useCouponStore();

const { ticketList, couponList, walletData } = storeToRefs(store);

ticketList.value = couponDataJson.data.ticket_list;
couponList.value = couponDataJson.data.coupon_list;
walletData.value = ticketWalletJson.data as Wallet[];

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

const couponStatusList = [
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

const admissionStatusList = [
  {
    id: 1,
    title: '我的訂單'
  },
  {
    id: 2,
    title: '已結束'
  }
];

watch(activeTab, () => {
  activeTicketStatus.value = 0;
});

const activeData = computed(() => {
  if (!walletData.value) {
    return null;
  }

  const data =
    activeTab.value === 0
      ? walletData.value.find((item) => item.ticket_type === TicketType.ADMISSION)
      : walletData.value.find((item) => item.ticket_type === TicketType.COUPON);

  if (activeTab.value === 0) {
    if (activeTicketStatus.value === 0) {
      return data?.data.find((item) => item.type === TicketStatusType.MYORDER);
    } else {
      return data?.data.find((item) => item.type === TicketStatusType.FINISHED);
    }
  } else {
    if (activeTicketStatus.value === 0) {
      return data?.data.find((item) => item.type === TicketStatusType.NOTREDEEMED);
    } else if (activeTicketStatus.value === 1) {
      return data?.data.find((item) => item.type === TicketStatusType.REDEEMED);
    } else {
      return data?.data.find((item) => item.type === TicketStatusType.EXPIRED);
    }
  }
});
</script>

<template>
  <ServiceTabsView v-model="activeTab" :tab-list="tabList">
    <template #tab0>
      <div
        class="pt-[18px] min-h-[calc(100vh-43px)]"
        :class="{
          'bg-grey-100': activeData && activeData.list.length
        }"
      >
        <ServiceTabsView
          v-model="activeTicketStatus"
          :tab-list="admissionStatusList"
          :contentType="true"
        >
          <template #tab0>
            <ul v-if="activeData && activeData.list.length" class="p-4 flex flex-col gap-y-3">
              <li v-for="item in activeData?.list" :key="item.id">
                <RouterLink :to="{ name: 'ticket-exchange', params: { id: item.id } }">
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
              <span class="text-[#5AB4C5] font-semibold text-lg my-5">目前無入場券</span>
            </div>
          </template>
          <template #tab1>
            <ul v-if="activeData && activeData.list.length" class="p-4 flex flex-col gap-y-3">
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
              <span class="text-[#5AB4C5] font-semibold text-lg my-5">目前無入場券</span>
            </div>
          </template>
        </ServiceTabsView>
      </div>
    </template>
    <template #tab1>
      <div
        class="pt-[18px] min-h-[calc(100vh-43px)]"
        :class="{
          'bg-grey-100': activeData && activeData.list.length
        }"
      >
        <ServiceTabsView
          v-model="activeTicketStatus"
          :tab-list="couponStatusList"
          :contentType="true"
        >
          <template #tab0>
            <ul v-if="activeData && activeData.list.length" class="p-4 flex flex-col gap-y-3">
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
            <ul v-if="activeData && activeData.list.length" class="p-4 flex flex-col gap-y-3">
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
            <ul v-if="activeData && activeData.list.length" class="p-4 flex flex-col gap-y-3">
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
