/**
 *
 * 傳遞訊息與 app 溝通
 * 目前格式為 { name: '', data: '' }
 */
export const useConnectionMessage = (
  name: string,
  data: Record<any, any> | string | number | null | undefined
) => {
  // @ts-ignore
  if (typeof flutterObject !== 'undefined' && flutterObject) {
    const postInfo = JSON.stringify({ name, data });
    // @ts-ignore
    flutterObject.postMessage(postInfo);
  }
};
