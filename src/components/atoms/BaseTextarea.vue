<script setup lang="ts">
const inputValue = defineModel();
</script>

<template>
  <textarea v-model="inputValue" maxlength="4000" class="base-textarea" />
</template>

<style lang="postcss">
.base-textarea {
  @apply bg-gray-100 h-32;
  @apply p-3;
  @apply rounded-lg outline-none;
  @apply overflow-y-auto;
}
</style>
