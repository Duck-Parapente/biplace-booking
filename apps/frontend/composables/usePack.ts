import type { CreatePackDto } from 'shared';

export const usePack = () => {
  const { callApi } = useApi();

  const loading = ref(false);
  const error = ref<string | null>(null);
  const showCreateModal = ref(false);
  const creating = ref(false);
  const createError = ref<string | null>(null);
  const createSuccess = ref(false);

  const packForm = ref<CreatePackDto>({
    label: '',
    ownerId: '',
    flightsHours: undefined,
    flightsCount: undefined,
  });

  const openCreatePackModal = () => {
    showCreateModal.value = true;
    createError.value = null;
    createSuccess.value = false;
    // Reset form
    packForm.value = {
      label: '',
      ownerId: '',
      flightsHours: undefined,
      flightsCount: undefined,
    };
  };

  const closeCreatePackModal = () => {
    showCreateModal.value = false;
  };

  const createPack = async () => {
    try {
      creating.value = true;
      createError.value = null;
      createSuccess.value = false;

      // Prepare the payload - only include optional fields if they have values
      const payload: CreatePackDto = {
        label: packForm.value.label,
        ownerId: packForm.value.ownerId,
        flightsHours: packForm.value.flightsHours,
        flightsCount: packForm.value.flightsCount,
      };

      await callApi('/pack/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      createSuccess.value = true;

      // Close modal after a short delay
      setTimeout(() => {
        closeCreatePackModal();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Impossible de créer le pack';
      createError.value = errorMessage;
      console.error('Failed to create pack:', err);
    } finally {
      creating.value = false;
    }
  };

  const initializePacks = () => {
    // Future: Load pack list here
    loading.value = false;
  };

  return {
    loading,
    error,
    showCreateModal,
    creating,
    createError,
    createSuccess,
    packForm,
    openCreatePackModal,
    closeCreatePackModal,
    createPack,
    initializePacks,
  };
};
