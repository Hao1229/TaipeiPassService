<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseMultipleSelect from '@/components/atoms/BaseMultipleSelect.vue';
import BaseTextarea from '@/components/atoms/BaseTextarea.vue';
import BaseRadio from '@/components/atoms/BaseRadio.vue';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import DatePicker from '@/components/molecules/DatePicker.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
// import UploadSection from '@/components/molecules/UploadSection.vue';
import { useFormStore } from '@/stores/form';
import type { FeePayment } from '@/interfaces/fee-payment.interface';

const props = withDefaults(
  defineProps<{
    paymentItem: FeePayment;
    tabIndex: number;
    triggerValidate?: boolean;
  }>(),
  {
    triggerValidate: false
  }
);

const emit = defineEmits(['onFormChange']);

const form = reactive<any>({});

const onSubmitClick = () => {};
</script>

<template>
  <div class="p-4">
    <!-- 這邊開始透過 API 的 form format 來組成 -->
    <div
      v-for="(item, index) in paymentItem.search_type_list[props.tabIndex].form_format"
      :key="index"
    >
      <!-- type = input -->
      <div v-if="item.type === 'input'" class="flex flex-col">
        <label :for="item.field" class="field-label">
          {{ item.label }}
          <!-- <span v-if="item.required">*</span> -->
        </label>
        <p class="text-grey-400 mb-2" v-if="item.description">{{ item.description }}</p>
        <BaseInput
          v-model="form[item.field]"
          :id="item.field"
          class="w-full"
          :label="item.label"
          :required="item.required"
          :placeholder="`請輸入${item.label}`"
        />
      </div>
    </div>
    <!-- 注意事項 -->
    <div class="mt-4" v-if="paymentItem.search_type_list[props.tabIndex].notice?.length">
      <p class="text-sm mb-2">注意事項</p>
      <ul class="list-disc pl-4">
        <li
          v-for="item in paymentItem.search_type_list[props.tabIndex].notice"
          :key="item"
          class="text-sm"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
  <!-- 底部 button -->
  <div class="floating-box bottom-0 w-full">
    <p class="text-center text-primary-500 mb-2">逾繳費期限，不提供查詢繳費功能</p>
    <BaseButton class="w-full" @click="onSubmitClick()"> 查詢 </BaseButton>
  </div>
</template>

<style lang="postcss" scoped>
.floating-box {
  @apply absolute justify-between bg-white px-4 py-6 rounded-xl;
  box-shadow: rgba(0, 0, 0, 0.04) 0px -4px 10px;
}
</style>
