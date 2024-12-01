<script setup lang="ts">
import { onMounted } from 'vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import router from '@/router';

const handleScan = (event: { data: string | null }) => {
  if (event.data) {
    const result: { name: string; data: { id: string } } = JSON.parse(event.data);
    console.log('result:', result.data);

    router.push({ name: 'fee-payment-result', params: { id: result.data.id } });
  }
};

useConnectionMessage('qr_code_scan', null);

useHandleConnectionData(handleScan);

onMounted(() => {
  // setTimeout(() => {
  //   const json = {
  //     name: 'qr_code_scan',
  //     data: { id: 'fee-1' }
  //   };
  //   const scanString: string = JSON.stringify(json);
  //   console.log('scanString:', scanString);
  //   handleScan({ data: scanString });
  // }, 2000);
});
</script>
