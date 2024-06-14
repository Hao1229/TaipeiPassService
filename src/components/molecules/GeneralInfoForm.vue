<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';

const isExpand = ref(true);

const basicForm = reactive({
  mail: '',
  city: '',
  county: '',
  address: ''
});

// TODO: 鄉鎮市資料串 API
const cityOptions = [
  {
    label: '臺北市',
    value: '臺北市'
  },
  {
    label: '新北市',
    value: '新北市'
  }
];

const countyOptions = computed(() =>
  basicForm.city
    ? [
        {
          label: '中和區',
          value: '中和區'
        },
        {
          label: '北投區',
          value: '北投區'
        }
      ]
    : []
);

const triggerValidate = ref(false);
</script>

<template>
  <section>
    <div class="py-5 px-4">
      <button
        class="w-full flex justify-between items-center"
        @click.prevent="isExpand = !isExpand"
      >
        <div class="flex items-end">
          <img src="@/assets/images/person-icon.svg" class="transition-transform" />
          <span class="text-primary-500 font-bold ml-2">基本資料</span>
        </div>
        <img
          src="@/assets/images/down-icon-primary.svg"
          class="transition-transform"
          :class="{
            'rotate-180': isExpand
          }"
        />
      </button>
      <div
        class="grid grid-rows-[0fr] transition-all"
        :class="{
          'grid-rows-[1fr]': isExpand
        }"
      >
        <div class="overflow-hidden flex flex-col gap-4 pt-5">
          <div class="flex flex-col">
            <label for="mail" class="field-label">
              電子信箱
              <span>*</span>
            </label>
            <BaseInput
              id="mail"
              class="w-full"
              placeholder="請輸入電子信箱"
              :required="true"
              :triggerValidate="triggerValidate"
              label="電子信箱"
              v-model="basicForm.mail"
            />
          </div>
          <div class="flex flex-col">
            <label for="city" class="field-label">
              縣市
              <span>*</span>
            </label>
            <BaseSelect
              selectId="city"
              :options="cityOptions"
              :required="true"
              :triggerValidate="triggerValidate"
              default-selected="請選擇縣市"
              class="w-full"
              v-model="basicForm.city"
            />
          </div>
          <div class="flex flex-col">
            <label for="county" class="field-label">
              鄉鎮(市)區
              <span>*</span>
            </label>
            <BaseSelect
              selectId="county"
              :options="countyOptions"
              :required="true"
              :triggerValidate="triggerValidate"
              default-selected="請選擇鄉鎮區"
              class="w-full"
              v-model="basicForm.county"
            />
          </div>
          <div class="flex flex-col">
            <label for="address" class="field-label">
              通訊地址
              <span>*</span>
            </label>
            <BaseInput
              id="address"
              class="w-full"
              placeholder="請輸入通訊地址"
              :required="true"
              :triggerValidate="triggerValidate"
              label="通訊地址"
              v-model="basicForm.address"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss">
.field-label {
  @apply text-grey-700 font-bold;
  @apply mb-2;

  & > span {
    @apply text-primary-500;
  }
}
</style>
