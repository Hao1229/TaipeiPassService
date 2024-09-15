<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { TicketStatusType } from '@/views/TicketWallet.vue';

const props = defineProps<{
  name: string;
  img: string;
  date: string;
  type: TicketStatusType;
}>();

const dateText = computed(() => {
  switch (props.type) {
    case TicketStatusType.NOTREDEEMED:
      return '截止';
    case TicketStatusType.REDEEMED:
      return '兌換';
    case TicketStatusType.EXPIRED:
      return '過期';
    default:
      return '';
  }
});
</script>

<template>
  <div class="grid grid-cols-4 border border-grey-200 rounded-lg p-3 min-h-24">
    <div class="flex justify-center items-center">
      <img :src="props.img" :alt="props.name" />
    </div>
    <div class="flex flex-col justify-between col-span-3 px-3">
      <span class="font-semibold text-grey-600">{{ props.name }}</span>
      <span class="text-sm text-grey-400">{{ props.date }} {{ dateText }}</span>
    </div>
  </div>
</template>
