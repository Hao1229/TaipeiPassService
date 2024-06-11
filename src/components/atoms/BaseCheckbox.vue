<script setup lang="ts">
import type { Option } from '@/components/atoms/BaseSelect.vue';

const props = defineProps<{
  option: Option;
}>();

const inputValue = defineModel();
</script>

<template>
  <label :for="props.option.label" class="flex items-center">
    <input
      type="checkbox"
      name=""
      :id="props.option.value"
      :value="props.option.value"
      class="base-checkbox"
      v-model="inputValue"
    />
    <div class="relative mr-1">
      <img src="@/assets/images/checkbox-default.svg" class="w-5 h-5" />
      <img src="@/assets/images/checkbox-checked.svg" class="w-5 h-5 absolute inset-0 opacity-0" />
    </div>
    <span>{{ props.option.label }}</span>
  </label>
</template>

<style lang="postcss">
.base-checkbox {
  @apply w-0 h-0 opacity-0 absolute;

  &:checked {
    & + span {
      @apply text-primary-500;
    }

    & ~ div {
      & > img {
        &:first-child {
          @apply opacity-0;
          @apply transition-opacity;
        }

        &:last-child {
          @apply opacity-100;
          @apply transition-opacity;
        }
      }
    }
  }
}
</style>
