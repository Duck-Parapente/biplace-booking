import { PublicConfigDto } from 'shared';
import { ref, onMounted, onUnmounted } from 'vue';

const POLLING_INTERVAL_MS = 30_000;

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
    } finally {
      isLoading.value = false;
    }
  };

  const startPolling = () => {
    // Fetch immediately
    fetchPublicConfig();

    // Then poll every 10 seconds
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
