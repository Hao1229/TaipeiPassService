<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCitizenReportStore } from '@/stores/citizenReport';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import BaseInput from '@/components/atoms/BaseInput.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import ReportExpressButton from '@/components/molecules/ReportExpressButton.vue';
import citizenReportDataJson from '../../public/mock/citizen_report.json';

const store = useCitizenReportStore();

const { citizenReport } = storeToRefs(store);

citizenReport.value = citizenReportDataJson.data;

const tabList = [
  {
    id: 1,
    title: '通報'
  },
  {
    id: 2,
    title: '查詢'
  }
];

const activeTab = ref(0);

const onServicePhoneClick = () => {
  useConnectionMessage('1999agree', null);
};
</script>

<template>
  <div>
    <ServiceTabsView v-model="activeTab" :tab-list="tabList">
      <template #tab0>
        <div class="bg-grey-100 pt-[18px] px-4 min-h-[calc(100vh-43px)] pb-4">
          <p class="text-grey-700 font-semibold">選擇要通報項目</p>
          <div class="flex my-3">
            <BaseInput readonly placeholder="您遇到哪些問題?" class="flex-grow" />
            <button class="search-button">
              <img src="@/assets/images/search-icon.svg" alt="搜尋" />
            </button>
          </div>
          <ul v-if="citizenReport" class="grid grid-cols-2 gap-x-3 gap-y-2">
            <li v-for="item in citizenReport.hot_report" :key="item.id">
              <ReportExpressButton :title="item.name" :id="item.id" :icon="item.icon" />
            </li>
          </ul>
          <RouterLink
            :to="{ name: 'citizen-report-list' }"
            class="flex justify-center items-center bg-white rounded-lg border border-grey-200 mt-4 py-4 text-sm"
          >
            <img src="@/assets/images/other-icon.svg" width="20" height="20" class="size-5 mr-2" />
            <span>更多項目</span>
          </RouterLink>
          <p class="text-grey-700 font-semibold mt-1 mb-2">語音通報</p>
          <button
            class="flex justify-center items-center bg-white rounded-lg border border-grey-200 py-4 text-sm w-full"
            @click="onServicePhoneClick"
          >
            <img src="@/assets/images/icon_tel.svg" width="20" height="20" class="size-5 mr-2" />
            <span>撥打1999專線</span>
          </button>
        </div>
      </template>
      <template #tab1>test2</template>
    </ServiceTabsView>
  </div>
</template>
