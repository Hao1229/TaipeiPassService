<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const counterStore = useCounterStore();
const { counterList, regularlyUsedList } = storeToRefs(counterStore);

const model = ref([]);

const options = computed(() => {
  return regularlyUsedList.value.map((item) => {
    return {
      label: item.name,
      value: item.name
    };
  });
});

const onSubmitClick = () => {
  const namesToDelete = new Set<string>(model.value);

  counterList.value = counterList.value.map((counter) => {
    // Check if counter has a list and map through the list
    const updatedList = counter.list?.map((item) => {
      if (namesToDelete.has(item.name)) {
        // If the name is in namesToDelete, set is_regularly_used to false
        return {
          ...item,
          is_regularly_used: false
        };
      }
      return item;
    });

    // Return the updated counter with the modified list
    return {
      ...counter,
      list: updatedList || counter.list // Keep the original list if undefined
    };
  });

  router.push({ name: 'counter-calling' });
};
</script>

<template>
  <div class="px-5 py-8 bg-white">
    <h5 class="font-bold mb-3">請選擇要移除的地點</h5>
    <div class="w-full flex flex-col">
      <BaseCheckbox
        v-for="option in options"
        :key="option.value"
        :option="option"
        v-model="model"
        class="regularly-used-wrapper"
      />
    </div>
    <BaseButton :shape="'rounded'" @click="onSubmitClick" class="mt-4 w-full">移除地點</BaseButton>
  </div>
</template>

<style lang="postcss" scoped>
.regularly-used-wrapper {
  @apply relative py-5 mb-3 border-b border-grey-50 w-full;
  @apply flex items-center;
}
</style>
