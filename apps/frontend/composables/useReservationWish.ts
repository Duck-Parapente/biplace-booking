import type { ReservationWishDto, CreateReservationWishDto } from 'shared';

const BASE_PATH = '/reservation-wishes';

export const useReservationWish = () => {
  const { callApi } = useApi();

  const reservationWishes = useState<ReservationWishDto[]>('reservationWishes', () => []);
  const loading = useState<boolean>('reservationWishesLoading', () => false);
  const error = useState<string | null>('reservationWishesError', () => null);

  const submitting = useState<boolean>('reservationWishSubmitting', () => false);
  const submitError = useState<string | null>('reservationWishSubmitError', () => null);
  const submitSuccess = useState<boolean>('reservationWishSubmitSuccess', () => false);

  const cancelling = useState<boolean>('reservationWishCancelling', () => false);
  const cancellingError = useState<string | null>('reservationWishCancellingError', () => null);
  const cancellingSuccess = useState<boolean>('reservationWishCancellingSuccess', () => false);

  const addReservationWishForm = useState<CreateReservationWishDto>(
    'addReservationWishForm',
    () => ({
      startingDate: '',
      packChoices: [],
    }),
  );

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
