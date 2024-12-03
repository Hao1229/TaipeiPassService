<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import router from '@/router';
import BaseDialog from '@/components/atoms/BaseDialog.vue';

const handleScan = (event: { data: string }) => {
  const result: { name: string; data: string } = JSON.parse(event.data);
  console.log('result:', result.data);
  const id = JSON.parse(result.data)?.id;
  if (id) {
    const navigateToResult = async () => {
      try {
        await router.push({ name: 'fee-payment-result', params: { id } });
        console.log('Navigation successful');
      } catch (error) {
        console.error('Navigation failed:', error);
      }
    };
    navigateToResult();
    // router.push({ name: 'fee-payment-result', params: { id: result.data.id } });
  } else {
    isErrorDialogOpen.value = true;
  }
};

useConnectionMessage('qr_code_scan', null);

useHandleConnectionData(handleScan);

const isErrorDialogOpen = ref(false);

onMounted(() => {
  // setTimeout(() => {
  //   const json = {
  //     name: 'qr_code_scan',
  //     data: JSON.stringify({ id: 'fee-1' })
  //   };
  //   const scanString: string = JSON.stringify(json);
  //   console.log('scanString:', scanString);
  //   handleScan({ data: scanString });
  // }, 2000);
});
</script>

<template>
  <BaseDialog
    v-model="isErrorDialogOpen"
    :isAlert="true"
    title="讀取失敗"
    content="此類型的行動條碼不適用"
    positiveText="重新掃描"
    @onPositiveClick="
      isErrorDialogOpen = false;
      useConnectionMessage('qr_code_scan', null);
    "
  />
</template>
