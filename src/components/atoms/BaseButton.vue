<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  label: string;
  outline?: boolean;
  link?: boolean;
  routeInfo?: RouteLocationRaw;
}>();

const emit = defineEmits({
  click: null
});
</script>

<template>
  <RouterLink
    v-if="props.link && props.routeInfo"
    :to="props.routeInfo"
    class="base-button text-center"
    :class="{ 'base-button--outline': props.outline }"
  >
    {{ props.label }}
  </RouterLink>
  <button
    v-else
    class="base-button"
    :class="{ 'base-button--outline': props.outline }"
    @click.prevent="() => emit('click')"
  >
    {{ props.label }}
  </button>
</template>

<style lang="postcss">
.base-button {
  @apply outline-none;
  @apply rounded-lg;
  @apply bg-primary-500 text-white;
  @apply p-3;

  &--outline {
    @apply border border-primary-500;
    @apply bg-transparent text-primary-500;
  }
}
</style>
