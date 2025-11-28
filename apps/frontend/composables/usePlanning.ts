import { PlanningDayDto, PackPlanningDto } from 'shared';
import { ref } from 'vue';

export const usePlanning = () => {
  const { callApi } = useApi();

  const packs = ref<PackPlanningDto[]>([]);
  const planningDays = ref<PlanningDayDto[]>([]);

  function formatDateToString(date: Date): string {
    const result = date.toISOString().split('T')[0];
    return result || '';
  }

  async function fetchPlanning(startDate: Date, endDate: Date) {
    const startDateStr = formatDateToString(startDate);
    const endDateStr = formatDateToString(endDate);

    try {
      const data = await callApi<PlanningDayDto[]>(
        `/planning?startDate=${startDateStr}&endDate=${endDateStr}`,
      );

      // Extract unique packs from the fetched data
      const packsMap = new Map<string, PackPlanningDto>();
      data.forEach((day) => {
        day.packs.forEach((pack) => {
          if (!packsMap.has(pack.packId)) {
            packsMap.set(pack.packId, pack);
          }
        });
      });
      packs.value = Array.from(packsMap.values());

      planningDays.value = data;
    } catch (error) {
      console.error('Failed to fetch planning:', error);
    }
  }

  return {
    packs,
    planningDays,
    fetchPlanning,
  };
};
