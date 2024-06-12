<script setup lang="ts">
const props = withDefaults(defineProps<{ stepCount?: number; activeStep: number }>(), {
  stepCount: 2,
  activeStep: 1
});
</script>

<template>
  <div class="relative flex justify-between">
    <div
      v-for="step in props.stepCount"
      :key="step"
      class="step"
      :class="{ 'step--active': props.activeStep >= step }"
    >
      <span>{{ step }}</span>
    </div>
    <div class="connect-line" />
  </div>
</template>

<style lang="postcss">
.step {
  @apply text-white;
  @apply bg-grey-700;
  @apply rounded-full;
  @apply w-7 h-7;
  @apply flex justify-center items-center;
  @apply z-20;

  &--active {
    @apply bg-primary-500;
  }
}

.connect-line {
  @apply absolute top-1/2 -translate-y-1/2 left-7;
  @apply w-[calc(100%-56px)] h-0.5;
  @apply bg-grey-100;
  @apply z-10;
}
</style>
