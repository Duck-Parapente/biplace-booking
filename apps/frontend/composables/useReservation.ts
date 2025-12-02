export const useReservation = () => {
  const { callApi } = useApi();

  const cancelReservation = async (reservationId: string): Promise<void> => {
    await callApi(`/reservations/${reservationId}`, { method: 'DELETE' });
  };

  return {
    cancelReservation,
  };
};
