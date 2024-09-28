import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface CitizenReportData {
  hot_report: {
    id: string;
    name: string;
    icon: string;
  }[];
  all_report: {
    id: string;
    name: string;
    icon: string;
    service_requesting: {
      id: string;
      name: string;
    }[];
    problem_reporting: {
      id: string;
      name: string;
    }[];
  }[];
}

export const useCitizenReportStore = defineStore('citizenReport', () => {
  const citizenReport = ref<CitizenReportData>();

  const reportItemMap = computed(() => {
    if (!citizenReport.value || !citizenReport.value.all_report) {
      return new Map([]);
    } else {
      const problemReporting = citizenReport.value.all_report
        .map((item) => item.problem_reporting)
        .flat();

      const serviceRequesting = citizenReport.value.all_report
        .map((item) => item.service_requesting)
        .flat();

      const concatData = [...problemReporting, ...serviceRequesting];

      return new Map(concatData.map((item) => [item.id, item]));
    }
  });

  return { citizenReport, reportItemMap };
});
