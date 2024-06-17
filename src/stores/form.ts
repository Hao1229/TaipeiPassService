import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', () => {
  const formFormat = ref<any>();

  const fileList = ref<File[]>([]);

  const userName = ref('');
  const userPhone = ref('');
  const userTaxID = ref('');

  const reset = () => {
    formFormat.value = undefined;
    fileList.value = [];
  };

  return { formFormat, fileList, userName, userPhone, userTaxID, reset };
});
