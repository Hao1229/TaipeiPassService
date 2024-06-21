import type { Spot } from "@/views/SurroundingServiceView.vue";

// 格式化 YouBike API 返回的數據
export const youBikeFormatter = (item: any): Spot => {
    return {
        id: item.sno,
        name: item.sna,
        area: item.sarea,
        address: item.ar,
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        ...item
    };
}

// 另一個 API 的格式化函數
export const otherApiFormatter = (item: any): Spot => {
    return {
        id: item.id,
        name: item.stationName,
        area: item.district,
        address: item.address,
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        ...item
    };
}