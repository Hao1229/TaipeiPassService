<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import BaseInput from '@/components/atoms/BaseInput.vue';

const date = defineModel();
const masks = ref({
  input: 'YYYY-MM-DD'
});
</script>

<template>
  <DatePicker v-model="date" :masks="masks">
    <template #default="{ togglePopover, inputValue }">
      <BaseInput v-bind:model-value="inputValue" readonly @click="togglePopover" />
    </template>
  </DatePicker>
</template>
