<script setup lang="ts">
import FindPlace, { type Place } from '@/components/molecules/FindPlace.vue';
import SpotList from '@/components/organisms/SpotListView.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import axios from 'axios';
import { Ref, onMounted, ref, watch } from 'vue';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import greenDotIconUrl from '@/assets/images/mappin-green.svg';
import greenFocusIconUrl from '@/assets/images/mappin-green-focus.svg';
import { youBikeFormatter } from '@/utils/spot-formatter.ts';

export interface Spot {
  id: string;
  /** 站點名稱 */
  name: string;
  /** 行政區 */
  area: string;
  /** 地址 */
  address: string;
  /** 經度 */
  latitude: number;
  /** 緯度 */
  longitude: number;

  /** 其餘詳細資訊 */
  [key: string]: any;
}

const googleMapsStore = useGoogleMapsStore();

const selectedSearchData = ref<Place>({
  id: '',
  name: '',
  icon: '',
  agency: '',
  type: ''
});

// const searchValue = ref('');
// const searchValueName = ref('');

/** 搜尋結果 */
const searchSpotList = ref<Spot[]>([]);
/** 視窗下搜尋結果 */
const filteredSpotList = ref<Spot[]>([]);

/** 是否展開找地點面板 */
const isExpand = ref(false);
/** 是否點選展開列表 */
const isExpandList = ref(false);

let isMapReady = ref(false);

let map: any = null;
let markers: google.maps.Marker[] = [];
let markerCluster: any = null;

/**
 * 目前選定位置
 */
const selectLocation = ref<{ lat: number; lng: number; results: any[] }>({
  // 預設經緯度在信義區附近
  lat: 25.0325917,
  lng: 121.5624999,
  results: []
});

const locations = ref<{ lat: number; lng: number }[]>([]);

onMounted(() => {
  initMap(selectLocation.value.lat, selectLocation.value.lng);
});

const handleExpandChange = (newValue: boolean) => {
  isExpand.value = newValue;
};

const handleSearchChange = (data: Place) => {
  if (!data) {
    return;
  }
  console.log('handleSearchChange:', data);
  searchSpotList.value = [];
  selectedSearchData.value = data;

  switch (data.id) {
    case 'pa-1':
      fetchYouBikeData();
      break;
    default:
      clearMarkers();
      break;
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
      zoom: 13,
      // 限制使用者能縮放地圖的最大比例
      maxZoom: 20,
      // 限制使用者能縮放地圖的最小比例
      minZoom: 3,
      // 設定是否呈現右下角街景小人
      streetViewControl: false,
      // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: false,
      mapId: 'fc1ec68c1093dea4'
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
    map.addListener('dragend', function () {
      updateMarkers();
    });

    // // 在地圖的zoom_changed事件上使用該函數
    map.addListener('zoom_changed', function () {
      updateMarkers();
    });

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

const fetchAndFormatData = async (url: string, formatter: (item: any) => Spot) => {
  try {
    const response = await axios.get(url);
    return formatSpotData(response.data, formatter);
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    return [];
  }
};

const formatSpotData = (data: any, formatter: (item: any) => Spot): Spot[] => {
  return data.map(formatter);
};

const fetchYouBikeData = async () => {
  searchSpotList.value = await fetchAndFormatData(
    'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json',
    youBikeFormatter
  );
  console.log('searchSpotList:', searchSpotList.value);
};

const updateMarkers = async () => {
  if (!selectedSearchData.value.id) {
    clearMarkers();
    return;
  }

  const svgContent = `
        <svg fill="#2eb6c7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100" height="100">
          <circle fill="#2eb6c7" cx="120" cy="120" opacity=".6" r="90" />
          <circle fill="#fff" cx="120" cy="120" r="70" />
          <text x="50%" y="50%" style="fill:#2eb6c7" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">Custom</text>
        </svg>
      `;
  // 點擊後顯示相關資訊
  const infoWindow = new google.maps.InfoWindow({
    content: `<div class="bg-primary-500">123</div>`,
    disableAutoPan: true,
    headerDisabled: true
  });

  const bounds = map.getBounds();
  if (!bounds) return;

  filteredSpotList.value = searchSpotList.value.filter((spot) => {
    const position = new google.maps.LatLng(spot.latitude, spot.longitude);
    return bounds.contains(position);
  });

  console.log('filteredSpotList:', filteredSpotList.value);

  locations.value = filteredSpotList.value.map((spot) => {
    return { lat: Number(spot.latitude), lng: Number(spot.longitude) };
  });

  // Clear existing markers
  clearMarkers();

  const greenDotIcon = {
    url: greenDotIconUrl, // 默認綠色小圓點圖標的路徑
    scaledSize: new google.maps.Size(20, 20), // 設置圖標的大小
    anchor: new google.maps.Point(10, 10) // 設置圖標的錨點，使其中心對齊
  };

  const focusedIcon = {
    url: greenFocusIconUrl, // 點擊後聚焦圖標的路徑
    scaledSize: new google.maps.Size(30, 30), // 設置圖標的大小
    anchor: new google.maps.Point(15, 15) // 設置圖標的錨點，使其底部中心對齊
  };

  let currentFocusedMarker: any = null;

  locations.value.forEach((position, i) => {
    const marker = new google.maps.Marker({
      position,
      map,
      icon: greenDotIcon
    });

    marker.addListener('click', () => {
      if (currentFocusedMarker && currentFocusedMarker !== marker) {
        // 恢復之前聚焦的標記為默認圖標
        currentFocusedMarker.setIcon(greenDotIcon);
      }

      // 設置當前標記為聚焦圖標
      marker.setIcon(focusedIcon);
      currentFocusedMarker = marker;

      infoWindow.setContent(`Latitude: ${position.lat}, Longitude: ${position.lng}`);
      infoWindow.open(map, marker);
    });

    markers.push(marker);
  });

  // Add a marker clusterer to manage the markers.
  markerCluster = new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({ radius: 300 }), // 设置gridSize
    renderer: {
      render({ count, position }, stats) {
        // change color if this cluster has more markers than the mean cluster
        const circleRadius =
          count > Math.max(10, stats.clusters.markers.mean)
            ? count > Math.max(100, stats.clusters.markers.mean)
              ? '100'
              : '90'
            : '80';
        // create svg literal with fill color
        const svg =
          window.btoa(`<svg fill="#2eb6c7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
          <circle fill="#2eb6c7" cx="120" cy="120" opacity=".6" r="${circleRadius}" />
          <circle fill="#fff" cx="120" cy="120" r="70" />
          <text x="50%" y="50%" style="fill:#2eb6c7" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
          </svg>`);

        // create marker using svg icon
        return new google.maps.Marker({
          position,
          icon: {
            url: `data:image/svg+xml;base64,${svg}`,
            scaledSize: new google.maps.Size(75, 75)
          },
          // adjust zIndex to be above other markers
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count
        });
      }
    }
  });
};

const clearMarkers = () => {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (markerCluster) {
    markerCluster.clearMarkers();
  }
};

// Watch for changes in searchSpotList
watch(searchSpotList, updateMarkers);
</script>

<template>
  <div class="pb-8 h-screen">
    <div :class="{ hidden: isExpandList, visible: !isExpandList }">
      <!-- 找地點搜尋框 -->
      <div class="flex items-center">
        <FindPlace
          @onSearchChange="(value) => handleSearchChange(value)"
          @update:isExpand="handleExpandChange"
        />
        <button
          v-if="selectedSearchData.id && !isExpand"
          class="bg-primary-500 w-[48px] h-[48px] flex items-center justify-center rounded-lg my-5 ml-2 mr-4"
        >
          <img src="@/assets/images/icon-filter-white.svg" width="24" alt="" />
        </button>
      </div>
      <!-- 地圖 -->
      <div class="relative flex-1" :class="{ hidden: isExpand, visible: !isExpand }">
        <div class="google-map" id="map"></div>
        <div v-if="isMapReady" class="gps" @click="getPositionClick">
          <img src="@/assets/images/gps.png" width="20" alt="" />
        </div>
      </div>
      <!-- 底部搜尋結果 -->
      <div
        v-if="selectedSearchData.id && !isExpand"
        class="absolute bottom-0 w-full flex items-center justify-between bg-white px-4 py-6 rounded-t-xl shadow-[0_-4px_10px_0_rgba(0,0,0,0.04)]"
      >
        <div class="flex items-center">
          <span class="font-bold mr-2">{{ selectedSearchData.name }}</span>
          <div class="text-primary-500 border border-primary-500 rounded-full px-2">
            {{ filteredSpotList.length }}筆結果
          </div>
        </div>
        <a class="text-primary-500" @click="isExpandList = true">展開列表</a>
      </div>
    </div>
    <!-- 搜尋結果列表 -->
    <SpotList
      v-if="selectedSearchData.id && isExpandList"
      :selectedSearchData="selectedSearchData"
      :filteredSpotList="filteredSpotList"
      @update:isExpandList="(value) => (isExpandList = value)"
    />
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
