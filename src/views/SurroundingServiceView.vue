<script setup lang="ts">
import FindPlace from '@/components/molecules/FindPlace.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import axios from 'axios';
import { Ref, onMounted, ref, watch } from 'vue';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import greenDotIconUrl from '@/assets/images/mappin-green.svg';
import greenFocusIconUrl from '@/assets/images/mappin-green-focus.svg';

interface Place {
  sno: string;
  sna: string;
  sarea: string;
  latitude: number;
  longitude: number;
}

const googleMapsStore = useGoogleMapsStore();

const searchValue = ref('');
const searchPlaceList = ref<Place[]>([]);
const isExpand = ref(false);

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

const handleSearchChange = (value: string) => {
  console.log('handleSearchChange:', value);
  searchPlaceList.value = [];
  searchValue.value = value;

  switch (value) {
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

const updateMarkers = async () => {
  if (!searchValue.value) {
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

  const filteredPlaces = searchPlaceList.value.filter((place) => {
    const position = new google.maps.LatLng(place.latitude, place.longitude);
    return bounds.contains(position);
  });
  locations.value = filteredPlaces.map((place) => {
    return { lat: Number(place.latitude), lng: Number(place.longitude) };
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

  let currentFocusedMarker = null;

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

// Watch for changes in searchPlaceList
watch(searchPlaceList, updateMarkers);
</script>

<template>
  <div class="pb-8 h-screen">
    <div class="flex items-center">
      <FindPlace
        @onSearchChange="(value) => handleSearchChange(value)"
        @update:isExpand="handleExpandChange"
      />
      <button
        v-if="searchValue && !isExpand"
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
