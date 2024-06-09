<script setup lang="ts">
export interface TabsProps {
  tabList?: {
    id: number | string;
    title: string;
  }[];
}

const props = withDefaults(defineProps<TabsProps>(), {
  tabList: () => [
    {
      id: 1,
      title: '申辦'
    },
    {
      id: 2,
      title: '查詢'
    }
  ]
});

const activeTab = defineModel({ default: 0 });
</script>

<template>
  <section class="tabs" :class="{ '!grid-cols-3': tabList.length % 3 === 0 }">
    <button
      v-for="(item, index) in props.tabList"
      :key="item.id"
      class="tab-label"
      :class="{ 'tab-label--active': index === activeTab }"
      @click="activeTab = index"
    >
      {{ item.title }}
    </button>
    <div class="slider" :style="{ transform: `translate(calc(100%*${activeTab}))` }" />
  </section>
</template>

<style lang="postcss">
.tabs {
  @apply grid grid-cols-2;
  @apply px-4 pt-2;
  @apply border-b border-b-grey-300;
}

.tab-label {
  @apply text-grey-700 font-bold mb-2;

  &--active {
    @apply text-primary-500;
  }
}

.slider {
  @apply relative bottom-0;
  @apply transition-all duration-500;
  @apply bg-primary-500;
  @apply w-full h-0.5;
}
</style>
