<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFormStore } from '@/stores/form';
import BaseRadio from '@/components/atoms/BaseRadio.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';

const props = defineProps<{
  submitForm: any;
}>();

const emit = defineEmits(['onModify']);

const store = useFormStore();

const { formFormat, fileList, userName, userPhone, userTaxID } = storeToRefs(store);

const router = useRouter();

const formFormatMap = computed(
  () => new Map(formFormat.value.data.map((item: { field: any }) => [item.field, item]))
);

const applyFieldTextHandle = (field: string) => {
  const item: any = formFormatMap.value.get(field);

  if (item.type === 'input' || item.type === 'select' || item.type === 'textarea') {
    return props.submitForm[field];
  } else if (item.type === 'multiple_select' || item.type === 'checkbox_group') {
    const map = new Map(
      item.options.map((el: { value: string | number; label: string }) => [el.value, el.label])
    );

    return props.submitForm[field].map((val: string | number) => map.get(val)).join();
  } else if (item.type === 'radio_group') {
    const map = new Map(
      item.options.map((el: { value: string | number; label: string }) => [el.value, el.label])
    );

    return map.get(props.submitForm[field]);
  } else if (item.type === 'date_picker') {
    return props.submitForm[field].toISOString().split('T')[0];
  } else {
    return '';
  }
};

const createImgPreviewUrl = (img: File) => {
  return URL.createObjectURL(img);
};

const isAgree = ref('Y');

const agreeOptions = ref([
  { label: '同意', value: 'Y' },
  { label: '不同意', value: 'N' }
]);

// TODO: 串 API 傳送資料
const onSubmitClick = () => {
  console.log('submitForm:', props.submitForm);
  isFinishDialogOpen.value = true;
};

const isFinishDialogOpen = ref(false);

const onPositiveClick = () => {
  router.push({ name: 'home', query: { isSearch: 'true' } });
};

const onNegativeClick = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <section>
    <div class="bg-grey-50 px-4 pb-1 flex">
      <img src="@/assets/images/person-icon.svg" />
      <span class="ml-2 font-bold">基本資料</span>
    </div>
    <ul class="px-4 py-2 flex flex-col gap-y-4">
      <li class="preview-item">
        <span class="field-name">姓名</span>
        <span>{{ userName }}</span>
      </li>
      <li class="preview-item">
        <span class="field-name">身分證字號</span>
        <span>{{ userTaxID }}</span>
      </li>
      <li class="preview-item">
        <span class="field-name">手機號碼</span>
        <span>{{ userPhone }}</span>
      </li>
      <li class="preview-item">
        <span class="field-name">電子信箱</span>
        <span>{{ props.submitForm?.mail }}</span>
      </li>
      <li class="preview-item">
        <span class="field-name">聯絡地址</span>
        <span>
          {{ `${props.submitForm?.city}${props.submitForm?.county}${props.submitForm?.address}` }}
        </span>
      </li>
    </ul>
  </section>
  <section>
    <div class="bg-grey-50 p-4 flex">
      <img src="@/assets/images/person-icon.svg" />
      <span class="ml-2 font-bold">申辦服務資料</span>
    </div>
    <ul class="px-4 py-2 flex flex-col gap-y-4">
      <li
        v-for="item in formFormat?.data ?? []"
        :key="item.field"
        class="preview-item"
        :class="{ 'preview-item--attachment': item.field === 'attachments' }"
      >
        <template v-if="item.field === 'attachments'">
          <span class="field-name">附件</span>
          <div class="flex flex-wrap gap-4 mt-2">
            <div v-for="item in fileList" :key="item.name">
              <img
                v-if="item?.type.includes('image')"
                :src="createImgPreviewUrl(item)"
                class="w-24 h-24 object-cover"
              />
              <div v-else class="w-24 h-24 bg-gray-100 flex justify-center items-center px-2">
                <p class="text-sm">{{ item?.name }}</p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <span class="field-name">{{ item.label }}</span>
          <span>{{ applyFieldTextHandle(item.field) }}</span>
        </template>
      </li>
    </ul>
  </section>
  <section class="px-4 mt-4">
    <p class="text-primary-500 font-bold">個人資料是否提供給承辦員</p>
    <p class="text-sm">承辦員如有執行法定職務之需求，可透過申請程序，取得您的個人資料。</p>
    <div class="flex flex-wrap gap-4 mt-2">
      <BaseRadio
        v-model="isAgree"
        v-for="option in agreeOptions"
        :key="option.value"
        :radioId="option.value"
        radioName="isAgree"
        :radioText="option.label"
      />
    </div>
  </section>
  <div class="grid grid-cols-2 gap-x-2 px-4 mt-4">
    <BaseButton label="修改" outline @click="emit('onModify')" />
    <BaseButton label="送出" :disabled="isAgree === 'N'" @click="onSubmitClick" />
  </div>
  <BaseDialog
    v-model="isFinishDialogOpen"
    title="案件已完成申辦"
    content="後續處理相關訊息可至案件查詢"
    positiveText="前往查看"
    negativeText="確認"
    @onPositiveClick="onPositiveClick"
    @onNegativeClick="onNegativeClick"
  />
</template>

<style lang="postcss">
.field-name {
  @apply text-gray-500;
}

.preview-item {
  @apply flex justify-between;

  &--attachment {
    @apply flex-col justify-start;
  }
}
</style>
