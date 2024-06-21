<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import type { Spot } from '@/views/SurroundingServiceView.vue';

const props = defineProps<{
  selectedSpot: Spot;
}>();
const emit = defineEmits(['update:isExpandDetail']);
</script>

<template>
  <div class="pb-8 h-screen flex flex-col">
    <!-- title -->
    <div class="p-5">
      <div class="flex items-center mb-2">
        <img
          src="@/assets/images/down-icon.svg"
          class="rotate-90 mr-2"
          @click="emit('update:isExpandDetail', false)"
          alt=""
        />
        <span class="font-bold text-xl">{{ selectedSpot.name }}</span>
      </div>
      <p class="text-grey-500 text-sm">{{ selectedSpot.agency }}</p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.rounded-button {
  @apply rounded-full;
  @apply bg-primary-500;
  @apply text-white;
  @apply px-5 py-4;
  @apply flex;
  @apply justify-center;
  @apply items-center;
}
</style>
