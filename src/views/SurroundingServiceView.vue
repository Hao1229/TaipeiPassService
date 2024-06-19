<script setup lang="ts">
import FindPlace from '@/components/molecules/FindPlace.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import axios from 'axios';
import { Ref, onMounted, ref } from 'vue';

interface Place {}

const googleMapsStore = useGoogleMapsStore();

const searchValue = ref('');
const searchPlaceList = ref<Place[]>([]);
const isExpand = ref(false);

let isMapReady = ref(false);

let map: any = null;

/**
 * 目前選定位置
 */
const selectLocation = ref<{ lat: number; lng: number; results: any[] }>({
  // 預設經緯度在信義區附近
  lat: 25.0325917,
  lng: 121.5624999,
  results: []
});

onMounted(() => {
  initMap(selectLocation.value.lat, selectLocation.value.lng);
});

const handleExpandChange = (newValue: boolean) => {
  isExpand.value = newValue;
};

const handleSearchChange = (value: string) => {
  console.log('handleSearchChange:', value);
  searchValue.value = value;
  if (value === 'pa-1') {
    fetchYouBikeData();
  }
};

const setMapHeight = () => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    mapElement.style.height = `${window.innerHeight - 88}px`;
  }
};

/**
 * 初始化地圖
 * @param lat 緯度
 * @param lng 經度
 */
const initMap = (lat: number, lng: number) => {
  googleMapsStore.loader.load().then(async () => {
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    map = new Map(document.getElementById('map') as HTMLElement, {
      // 設定地圖的中心點經緯度位置
      center: { lat, lng },
      // 設定地圖縮放比例 0-20
      zoom: 16,
      // 限制使用者能縮放地圖的最大比例
      maxZoom: 20,
      // 限制使用者能縮放地圖的最小比例
      minZoom: 3,
      // 設定是否呈現右下角街景小人
      streetViewControl: false,
      // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: false
    });

    console.log('initMap:', map);

    new google.maps.Marker({
      position: {
        lat: selectLocation.value.lat,
        lng: selectLocation.value.lng
      },
      map,
      title: 'your location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 1,
        scale: 8, // 控制大小
        strokeColor: 'white',
        strokeWeight: 2
      }
    });

    // const geocoder = new google.maps.Geocoder();
    // const center = map.getCenter();
    // console.log('center:', center);

    // googleMapsStore.getFullAddress(geocoder, center, handleGetFullAddressResponse);

    // 在地圖的dragend事件上使用該函數
    // map.addListener('dragend', function () {
    //   if (timeoutId) {
    //     clearTimeout(timeoutId);
    //   }

    //   timeoutId = setTimeout(() => {
    //     const center = map.getCenter();
    //     googleMapsStore.getFullAddress(geocoder, center, handleGetFullAddressResponse);
    //   }, 1000);
    // });

    // // 在地圖的zoom_changed事件上使用該函數
    // map.addListener('zoom_changed', function () {
    //   const center = map.getCenter();
    //   googleMapsStore.getFullAddress(geocoder, center, handleGetFullAddressResponse);
    // });

    isMapReady.value = true;
    setMapHeight();
    window.addEventListener('resize', setMapHeight);
  });
};

const getPositionClick = () => {
  // loadingStore.loading(true, '定位中...');
  googleMapsStore
    .gettingPosition()!!
    .then((position: any) => successCallback(position))
    .catch((error) => errorCallback(error));
};

const successCallback = (position: GeolocationPosition) => {
  console.log(position);
  selectLocation.value.lat = position.coords.latitude;
  selectLocation.value.lng = position.coords.longitude;

  // 使用者目前位置
  initMap(selectLocation.value.lat, selectLocation.value.lng);
  // loadingStore.loading(false, '');
};
const errorCallback = (error: any) => {
  console.log(error);
  if (error.code === 1) {
    // 使用者未開啟定位
    // showMapNotification.value = true;
    // 預設位置
    initMap(selectLocation.value.lat, selectLocation.value.lng);
    // loadingStore.loading(false);
  }
};

const fetchYouBikeData = async () => {
  try {
    const response = await axios.get<Place[]>(
      'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json'
    );
    searchPlaceList.value = response.data;
    console.log('searchPlaceList:', searchPlaceList.value);
  } catch (error) {
    console.error('Failed to fetch YouBike data:', error);
  }
};
</script>

<template>
  <div class="pb-8 h-screen">
    <div class="flex items-center">
      <FindPlace
        @onSearchChange="(value) => handleSearchChange(value)"
        @update:isExpand="handleExpandChange"
      />
      <button
        v-if="searchValue"
        class="bg-primary-500 w-[48px] h-[48px] flex items-center justify-center rounded-lg my-5 ml-2 mr-4"
      >
        <img src="@/assets/images/icon-filter-white.svg" width="24" alt="" />
      </button>
    </div>
    <div class="relative flex-1" :class="{ hidden: isExpand, visible: !isExpand }">
      <div class="google-map" id="map"></div>
      <div v-if="isMapReady" class="gps" @click="getPositionClick">
        <img src="@/assets/images/gps.png" width="20" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.google-map {
  width: 100%;
  height: 400px;
}
.marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
}
.gps {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: rgb(255, 255, 255);
  width: 40px;
  height: 40px;
  user-select: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
