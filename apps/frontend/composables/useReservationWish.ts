import type { ReservationWishDto, CreateReservationWishDto } from 'shared';

const BASE_PATH = '/reservation-wishes';

export const useReservationWish = () => {
  const { callApi } = useApi();

  const reservationWishes = ref<ReservationWishDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const submitting = ref(false);
  const submitError = ref<string | null>(null);
  const submitSuccess = ref(false);

  const cancelling = ref(false);
  const cancellingError = ref<string | null>(null);
  const cancellingSuccess = ref(false);

  const addReservationWishForm = ref<CreateReservationWishDto>({
    startingDate: '',
    packChoices: [],
  });

  const getReservationWishes = async (): Promise<ReservationWishDto[]> => {
    try {
      loading.value = true;
      error.value = null;
      const fetchedReservationWishes = await callApi<ReservationWishDto[]>(BASE_PATH);
      reservationWishes.value = fetchedReservationWishes;
      return fetchedReservationWishes;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de charger la liste des demandes';
      error.value = errorMessage;
      console.error('Failed to fetch wishes:', err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const submitReservationWish = async () => {
    try {
      submitting.value = true;
      submitError.value = null;
      submitSuccess.value = false;

      await callApi(BASE_PATH, {
        method: 'POST',
        body: JSON.stringify(addReservationWishForm.value),
      });

      submitSuccess.value = true;

      await getReservationWishes();

      setTimeout(() => {
        submitting.value = false;
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de créer une demande de réservation';
      submitError.value = errorMessage;
      console.error(errorMessage);
      submitting.value = false;
    }
  };

  const cancelReservationWish = async (reservationWishId: string) => {
    try {
      cancelling.value = true;
      cancellingError.value = null;
      cancellingSuccess.value = false;

      await callApi(`${BASE_PATH}/${reservationWishId}`, {
        method: 'DELETE',
      });

      cancellingSuccess.value = true;

      await getReservationWishes();

      setTimeout(() => {
        cancelling.value = false;
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de créer une demande de réservation';
      cancellingError.value = errorMessage;
      console.error(errorMessage);
      cancelling.value = false;
    }
  };

  return {
    reservationWishes,
    loading,
    error,
    submitting,
    submitError,
    submitSuccess,
    getReservationWishes,
    submitReservationWish,
    addReservationWishForm,
    cancelling,
    cancellingError,
    cancellingSuccess,
    cancelReservationWish,
  };
};
