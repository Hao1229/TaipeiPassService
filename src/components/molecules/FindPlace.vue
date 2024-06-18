<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import formJSON from '../../../public/mock/form.json';
import { useFormStore } from '@/stores/form';
import placeListJson from '../../../public/mock/place_list.json';

const searchValue = ref('');

/** 搜尋紀錄列表 */
const searchHistoryList = ref<
  { name: string; places: { id: string; name: string; icon: string; type: string }[] }[]
>([
  {
    name: '搜尋紀錄',
    places: [
      {
        id: 'sa-1',
        name: '微笑單車 2.0',
        icon: '',
        type: '搜尋紀錄'
      }
    ]
  }
]);
/** 服務列表 */
const placeList = ref(placeListJson);

const expandList = ref<string[]>([]);
const expandListSet = computed(() => new Set(expandList.value.map((name) => name)));

const onExpandClick = (name: string) => {
  if (expandListSet.value.has(name)) {
    const index = expandList.value.findIndex((el) => el === name);
    expandList.value.splice(index, 1);
  } else {
    expandList.value.push(name);
  }
};

const emit = defineEmits(['onFormChange']);

const store = useFormStore();

const { formFormat } = storeToRefs(store);

formFormat.value = formJSON;

const isExpand = ref(false);

const formValidateFieldMap = computed(
  () =>
    new Map(
      formFormat.value.data.map((item: { field: any; required: any }) => [
        item.field,
        item.required
      ])
    )
);
const form = reactive<any>({});

const createImgPreviewUrl = (img: File) => {
  return URL.createObjectURL(img);
};

const handleForm = () => {
  formJSON.data.forEach((item) => {
    switch (item.type) {
      case 'input':
        form[item.field] = '';
        break;
      case 'select':
        form[item.field] = '';
        break;
      case 'multiple_select':
        form[item.field] = [];
        break;
      case 'radio_group':
        form[item.field] = '';
        break;
      case 'textarea':
        form[item.field] = '';
        break;
      case 'checkbox_group':
        form[item.field] = [];
        break;
      case 'date_picker':
        form[item.field] = undefined;
        break;
      case 'upload':
        form[item.field] = [];
        break;
      default:
        form[item.field] = '';
    }
  });
};

onMounted(() => {
  handleForm();
});

watch(
  () => form,
  () => {
    const isValidate = Object.keys(form)
      .filter((key) => formValidateFieldMap.value.get(key))
      .every((key) => {
        const value = Array.isArray(form[key]) ? form[key].length : form[key];

        return !!value;
      });

    emit('onFormChange', {
      isValidate,
      form
    });
  },
  { deep: true }
);
</script>

<template>
  <section class="relative h-screen flex flex-col">
    <div class="py-5 px-4">
      <div class="base-select-wrapper" :class="{ expanded: isExpand }">
        <select
          v-bind="$attrs"
          id="findPlace"
          v-model="searchValue"
          class="base-select"
          @mousedown.prevent="isExpand = !isExpand"
        >
          <option value="" selected>請選擇要找的服務地圖</option>
        </select>
      </div>
    </div>
    <template v-if="isExpand">
      <div class="w-full flex flex-col overflow-y-auto">
        <ul>
          <li
            class="text-primary-500 bg-primary-50"
            v-for="item in searchHistoryList"
            :key="item.name"
            :class="{
              'bg-grey-50 pt-4': expandListSet.has(item.name),
              'py-4': !expandListSet.has(item.name)
            }"
          >
            <button
              class="px-4 w-full flex justify-between items-center text-grey-700 font-bold"
              :class="{
                'pb-4': expandListSet.has(item.name)
              }"
              @click="onExpandClick(item.name)"
            >
              <span>{{ item.name }}</span>
              <div class="flex items-center">
                <a
                  href=""
                  v-if="expandListSet.has(item.name)"
                  class="mr-2 underline text-primary-500"
                >
                  清空
                </a>
                <img
                  src="@/assets/images/down-icon.svg"
                  class="transition-transform"
                  :class="{
                    'rotate-180': expandListSet.has(item.name)
                  }"
                />
              </div>
            </button>
            <div
              class="grid grid-rows-[0fr] transition-all"
              :class="{
                'grid-rows-[1fr]': expandListSet.has(item.name)
              }"
            >
              <ul class="overflow-hidden">
                <li v-for="place in item.places" :key="place.name" class="px-4 bg-grey-50">
                  <div class="flex items-center py-5 px-4 border-b border-grey-200">
                    <img src="@/assets/images/icon-history.svg" class="w-6 h-6 mr-2" />
                    <span class="text-grey-700">
                      {{ place.name }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li class="py-5 px-4 text-primary-500 bg-primary-50" v-if="!searchHistoryList.length">
            無搜尋紀錄
          </li>
          <li class="py-5 px-4 bg-orange-100">防空避難設備</li>
          <li
            v-for="item in placeList.list"
            :key="item.name"
            :class="{
              'bg-grey-50 pt-4': expandListSet.has(item.name),
              'bg-white py-4': !expandListSet.has(item.name)
            }"
          >
            <button
              class="px-4 w-full flex justify-between items-center text-grey-700 font-bold"
              @click="onExpandClick(item.name)"
            >
              <span>{{ item.name }}</span>
              <img
                src="@/assets/images/down-icon.svg"
                class="transition-transform"
                :class="{
                  'rotate-180': expandListSet.has(item.name)
                }"
              />
            </button>
            <div
              class="grid grid-rows-[0fr] transition-all"
              :class="{
                'grid-rows-[1fr]': expandListSet.has(item.name)
              }"
            >
              <ul class="overflow-hidden">
                <li v-for="place in item.places" :key="place.name" class="px-4">
                  <div class="flex items-center py-5 px-4 border-b border-grey-200">
                    <!-- <img src="@/assets/images/icon-drinking.svg" class="w-6 h-6 mr-2" /> -->
                    <span class="text-grey-700">
                      {{ place.name }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, laudantium! Debitis
        praesentium laudantium tenetur tempore blanditiis sed qui a esse officiis? Fugit sint labore
        possimus nostrum ut quia impedit commodi repudiandae cumque soluta dolorum eligendi
        repellendus deleniti placeat sequi, ipsum nisi veniam culpa alias eveniet. Autem rerum earum
        corrupti, voluptates fuga nobis! Sed fugiat perspiciatis vitae et. Corporis, tenetur qui.
        Harum, alias. Voluptatibus porro alias possimus quisquam at, sapiente tempore vero tempora
        inventore, deleniti, fugiat quam similique minima praesentium ratione cum libero temporibus
        molestias. Inventore error aperiam repudiandae sapiente nam quos, qui expedita. Consequatur
        iure asperiores doloribus, labore facere non.
      </div>
    </template>
  </section>
</template>
<style lang="postcss" scoped>
.base-select-wrapper {
  @apply relative;
  @apply after:content-[''] after:w-6 after:h-6;
  @apply after:bg-[url('@/assets/images/down-icon.svg')] after:bg-cover after:bg-no-repeat;
  @apply after:block after:absolute after:top-1/2 after:-translate-y-1/2 after:right-2;

  &.expanded {
    @apply after:rotate-180;
  }
}

.absolute-div {
  @apply absolute left-0 right-0 w-full;
}
</style>
