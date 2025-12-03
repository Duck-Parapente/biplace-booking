export const useReservation = () => {
  const { callApi } = useApi();
  const { getReservationWishes } = useReservationWish();

  const cancelReservation = async (reservationId: string): Promise<void> => {
    await callApi(`/reservations/${reservationId}`, { method: 'DELETE' });
    await getReservationWishes();
  };

  return {
    cancelReservation,
  };
};
