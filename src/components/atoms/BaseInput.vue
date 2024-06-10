<script setup lang="ts">
const inputValue = defineModel();
</script>

<template>
  <input type="text" v-model="inputValue" class="base-input" />
</template>

<style lang="postcss">
.base-input {
  @apply rounded-lg outline-none;
  @apply bg-gray-100;
  @apply p-2.5;
}
</style>
