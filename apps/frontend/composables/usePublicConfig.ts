import { PublicConfigDto } from 'shared';
import { ref, onMounted, onUnmounted } from 'vue';

const POLLING_INTERVAL_MS = 1 * 60 * 1000;

export const usePublicConfig = () => {
  const { callPublicApi } = useApi();
  const maintenanceMode = ref(false);
  const isLoading = ref(true);
  let intervalId: NodeJS.Timeout | null = null;

  const fetchPublicConfig = async () => {
    try {
      const data = await callPublicApi<PublicConfigDto>('/public-config');
      maintenanceMode.value = data.maintenanceMode;
    } catch (error) {
      console.error('Error fetching public config:', error);
      maintenanceMode.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const startPolling = () => {
    fetchPublicConfig();

    intervalId = setInterval(() => {
      fetchPublicConfig();
    }, POLLING_INTERVAL_MS);
  };

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onMounted(() => {
    startPolling();
  });

  onUnmounted(() => {
    stopPolling();
  });

  return {
    maintenanceMode,
    isLoading,
  };
};
