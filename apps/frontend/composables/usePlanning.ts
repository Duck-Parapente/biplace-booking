import { PlanningDayDto, PackPlanningDto } from 'shared';

export const usePlanning = () => {
  const { callApi } = useApi();

  const packs = useState<PackPlanningDto[]>('planningPacks', () => []);
  const planningDays = useState<PlanningDayDto[]>('planningDays', () => []);

  function formatDateToString(date: Date): string {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
      packs.value = Array.from(packsMap.values()).sort((a, b) =>
        a.packLabel.localeCompare(b.packLabel),
      );

      // Sort packs within each day
      planningDays.value = data.map((day) => ({
        ...day,
        packs: [...day.packs].sort((a, b) => a.packLabel.localeCompare(b.packLabel)),
      }));
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
