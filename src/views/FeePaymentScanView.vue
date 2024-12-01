<script setup lang="ts">
import { onMounted } from 'vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import router from '@/router';

const handleScan = (event: { data: string | null }) => {
  if (event.data) {
    const result = JSON.parse(event.data);
    console.log('result:', result);

    router.push({ name: 'fee-payment-result', params: { id: result.id } });
  }
};

useConnectionMessage('qr_code_scan', null);

useHandleConnectionData(handleScan);

onMounted(() => {
  // setTimeout(() => {
  //   const scanString: string = JSON.stringify({ id: 'fee-1' });
  //   handleScan({ data: scanString });
  // }, 2000);
});
</script>
