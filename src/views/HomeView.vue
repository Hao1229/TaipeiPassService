<script setup lang="ts">
import { computed, ref } from 'vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import serviceListJson from '../../public/mock/serviceList.json';

/**
 * tab0 JS start
 */
const searchValue = ref('');
const serviceList = ref(serviceListJson);
const isSearch = ref(false);

const flatServiceList = computed(() =>
  serviceList.value.list
    .map((item) => item.agency)
    .reduce((prev, acc) => [...acc, ...prev], [])
    .map((item) => item.options)
    .reduce((prev, acc) => [...acc, ...prev], [])
);

const expandList = ref<string[]>([]);
const expandListSet = computed(() => new Set(expandList.value.map((name) => name)));

const onExpandClick = (name: string) => {
  if (expandListSet.value.has(name)) {
    const index = expandList.value.findIndex((el) => el === name);
    expandList.value.splice(index, 1);
  } else {
    expandList.value.push(name);
  }
};

const searchResult = ref<
  {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    agencyType: string;
  }[]
>();

const searchResultTypeSet = computed(() => new Set(searchResult.value?.map((item) => item.type)));
const searchResultAgencyTypeSet = computed(
  () => new Set(searchResult.value?.map((item) => item.agencyType))
);
const searchResultTitle = computed(() => searchResult.value?.map((item) => item.title));

const onSearchClick = () => {
  const result = flatServiceList.value.filter((option) => option.title.includes(searchValue.value));

  searchResult.value = result;
  expandList.value = Array.from(new Set(result.map((item) => item.type)));

  if (searchValue.value) {
    isSearch.value = true;
  } else {
    isSearch.value = false;
  }
};
/**
 * tab0 JS end
 */

/**
 * tab1 JS start
 */
const activeSituation = ref('apply');
/**
 * tab1 JS end
 */
</script>

<template>
  <main>
    <ServiceTabsView>
      <template #tab0>
        <div class="py-4">
          <section class="flex items-center px-4">
            <BaseInput v-model="searchValue" placeholder="您遇到哪些問題?" class="flex-grow" />
            <button class="search-button" @click="onSearchClick">
              <img src="@/assets/images/search-icon.svg" alt="搜尋" />
            </button>
          </section>
          <p class="text-grey-500 mt-4 mb-2 px-4">請選擇要申請的項目</p>
          <ul v-show="!isSearch || (isSearch && searchResult?.length)">
            <li
              v-show="!searchResult?.length || searchResultTypeSet.has(item.name)"
              v-for="item in serviceList.list"
              :key="item.name"
              @click="onExpandClick(item.name)"
              class="px-4 py-2"
              :class="{
                'bg-grey-50': expandListSet.has(item.name)
              }"
            >
              <button class="w-full flex justify-between items-center mb-5">
                <span>{{ item.name }}</span>
                <img
                  src="@/assets/images/down-icon.svg"
                  class="transition-transform"
                  :class="{
                    'rotate-180': expandListSet.has(item.name)
                  }"
                />
              </button>
              <div
                class="grid grid-rows-[0fr] transition-all"
                :class="{
                  'grid-rows-[1fr]': expandListSet.has(item.name)
                }"
              >
                <ul class="overflow-hidden">
                  <li
                    v-show="!searchResult?.length || searchResultAgencyTypeSet.has(agency.name)"
                    v-for="agency in item.agency"
                    :key="agency.name"
                  >
                    <div class="flex items-center mb-2">
                      <div class="w-2 h-2 rounded-full bg-primary-500 mr-3" />
                      <span class="text-primary-500 font-extrabold">
                        {{ agency.name }}
                      </span>
                    </div>
                    <div class="flex pl-[3px]">
                      <div class="w-0.5 bg-primary-500 mr-4 self-stretch"></div>
                      <ul>
                        <li
                          v-show="
                            !searchResult?.length ||
                            searchResultTitle?.filter((title) => title.includes(option.title))
                              .length
                          "
                          v-for="option in agency.options"
                          :key="option.id"
                          class="mb-3"
                        >
                          <p class="option-title">{{ option.title }}</p>
                          <p v-if="option.subtitle" class="text-sm text-grey-400">
                            {{ option.subtitle }}
                          </p>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div v-show="isSearch && !searchResult?.length" class="flex flex-col items-center pt-40">
            <p class="text-primary-500 font-bold">查無任何申辦相關項目</p>
          </div>
        </div>
      </template>
      <template #tab1>
        <div class="p-4">
          <section class="grid grid-cols-2">
            <button
              class="situation-button"
              :class="{ 'situation-button--active': activeSituation === 'apply' }"
              @click="activeSituation = 'apply'"
            >
              申辦中(0)
            </button>
            <button
              class="situation-button"
              :class="{ 'situation-button--active': activeSituation === 'done' }"
              @click="activeSituation = 'done'"
            >
              已結案(0)
            </button>
          </section>
          <section class="flex flex-col items-center pt-40">
            <p v-if="activeSituation === 'apply'" class="text-primary-500 font-bold">
              目前無申辦紀錄
            </p>
            <p v-else class="text-primary-500 font-bold">目前無結案紀錄</p>
          </section>
        </div>
      </template>
    </ServiceTabsView>
  </main>
</template>

<style lang="postcss">
.search-button {
  @apply bg-primary-500 p-1 rounded-lg;
  @apply h-11 w-11;
  @apply flex justify-center items-center;
  @apply -translate-x-1;
}

.option-title {
  @apply relative;
  @apply before:content-[''];
  @apply before:w-1.5 before:h-0.5;
  @apply before:bg-primary-500;
  @apply before:inline-block;
  @apply before:absolute before:-left-3.5 before:top-1/2 before:-translate-y-1/2;
}

.situation-button {
  @apply text-primary-500;
  @apply first:rounded-l last:rounded-r;
  @apply border border-primary-500;
  @apply py-0.5;

  &--active {
    @apply bg-primary-500 text-white;
  }
}
</style>
