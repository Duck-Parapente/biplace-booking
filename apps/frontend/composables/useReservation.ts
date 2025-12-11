import type { CloseReservationDto } from 'shared';

export const useReservation = () => {
  const { callApi } = useApi();
  const { getReservationWishes } = useReservationWish();

  const closing = useState<boolean>('reservationClosing', () => false);
  const closeError = useState<string | null>('reservationCloseError', () => null);
  const closeSuccess = useState<boolean>('reservationCloseSuccess', () => false);

  const cancelReservation = async (reservationId: string): Promise<void> => {
    await callApi(`/reservations/${reservationId}`, { method: 'DELETE' });
    await getReservationWishes();
  };

  const closeReservation = async (
    reservationId: string,
    closeData: CloseReservationDto,
  ): Promise<void> => {
    try {
      closing.value = true;
      closeError.value = null;
      closeSuccess.value = false;

      await callApi(`/reservations/${reservationId}/close`, {
        method: 'POST',
        body: JSON.stringify(closeData),
      });

      closeSuccess.value = true;

      await getReservationWishes();

      setTimeout(() => {
        closing.value = false;
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de clôturer la réservation';
      closeError.value = errorMessage;
      console.error(errorMessage);
      closing.value = false;
    }
  };

  const updateReservation = async (reservationId: string, cost: number): Promise<void> => {
    await callApi(`/reservations/${reservationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ cost }),
    });
  };

  return {
    cancelReservation,
    closeReservation,
    updateReservation,
    closing,
    closeError,
    closeSuccess,
  };
};
