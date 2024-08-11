<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useConnectionMessage } from '@/composables/useConnectionMessage';

const store = useUserStore();

const { user } = storeToRefs(store);

/**
 * 使用 flutter_inappwebview 的 Web Message Listeners 跟 app 做資料溝通
 * 目前定義的 connection object name 是 flutterObject
 * 開發者可以自己在城市通定義自己的名稱，定義好後記得要跟微服務同步即可
 * @see https://inappwebview.dev/docs/webview/javascript/communication#web-message-listeners
 */

useConnectionMessage('userinfo', null);

// @ts-ignore
if (typeof flutterObject !== 'undefined' && flutterObject) {
  // @ts-ignore
  flutterObject.onmessage = (event: any) => {
    if (event && event.data) {
      user.value = JSON.parse(event.data);
    }
  };
}
</script>

<template>
  <RouterView />
</template>
