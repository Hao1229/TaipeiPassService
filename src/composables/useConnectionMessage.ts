/**
 * 使用 flutter_inappwebview 的 Web Message Listeners 跟 app 做資料溝通
 * 目前定義的 connection object name 是 flutterObject
 * 開發者可以自己在城市通定義自己的名稱，定義好後記得要跟微服務同步即可
 * @see https://inappwebview.dev/docs/webview/javascript/communication#web-message-listeners
 */
import { onMounted, onUnmounted } from 'vue';

/**
 * @param name - 傳送給 app 讓 app 知道 web 需要什麼類型的溝通
 * @param data - 需要傳送給 app 的資料
 * @param cb - 針對 app 傳送回來的資料透過 callback 做處理，cb 只接收一個參數就是 parse 過後的 { name, data }，data 會是 app 給 web 的資料
 *
 * <strong>重要提醒：</strong>建議都在 /views 呼叫此 hook，該頁面所需的 app 資料都在屬於頁面的 view 處理，不要在 /components 層呼叫，以免不好管理，也避免監聽器重複創建造成非預期錯誤。
 */
export const useConnectionMessage = <T>(
  name: string,
  data: T,
  cb?: (result: { name: string; data: any }) => void
) => {
  // @ts-ignore
  if (typeof flutterObject !== 'undefined' && flutterObject) {
    // @ts-ignore
    const flutterObjectCopy = structuredClone(flutterObject);

    const postInfo = JSON.stringify({ name, data });
    // @ts-ignore
    flutterObjectCopy.postMessage(postInfo);

    if (cb) {
      const handleData = (event: string) => {
        const result: { name: string; data: any } = JSON.parse(event).data;
        cb(result);
      };

      // @ts-ignore
      flutterObjectCopy.addEventListener('message', handleData);

      onUnmounted(() => {
        // @ts-ignore
        flutterObjectCopy.removeEventListener('message', handleData);
      });
    }
  }
};
