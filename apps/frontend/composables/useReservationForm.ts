import type { CreateReservationDto, PackDto, UserDto } from 'shared';

export const useReservationForm = () => {
  const { callApi } = useApi();
  const { getPacks } = usePack();
  const { getUsers } = useUser();

  // Data refs
  const packs = ref<PackDto[]>([]);
  const users = ref<UserDto[]>([]);
  const loading = ref(false);
  const loadError = ref<string | null>(null);

  // Submission state
  const submitting = ref(false);
  const submitError = ref<string | null>(null);
  const submitSuccess = ref(false);

  /**
   * Load packs and users data
   */
  const loadData = async () => {
    try {
      loading.value = true;
      loadError.value = null;
      [packs.value, users.value] = await Promise.all([getPacks(), getUsers()]);
    } catch (err) {
      console.error('Failed to load data:', err);
      loadError.value = 'Impossible de charger les données';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Submit a new reservation
   */
  const submitReservation = async (formData: CreateReservationDto) => {
    try {
      submitting.value = true;
      submitError.value = null;
      submitSuccess.value = false;

      await callApi('/reservations', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      submitSuccess.value = true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de créer la réservation';
      submitError.value = errorMessage;
      console.error('Failed to create reservation:', err);
      throw err;
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Reset submission state
   */
  const resetSubmissionState = () => {
    submitError.value = null;
    submitSuccess.value = false;
  };

  return {
    // Data
    packs: readonly(packs),
    users: readonly(users),
    loading: readonly(loading),
    loadError: readonly(loadError),

    // Submission state
    submitting: readonly(submitting),
    submitError: readonly(submitError),
    submitSuccess: readonly(submitSuccess),

    // Actions
    loadData,
    submitReservation,
    resetSubmissionState,
  };
};
