import type { CreateReservationDto } from 'shared';

export const useReservationForm = () => {
  const { callApi } = useApi();

  // Submission state
  const submitting = useState('reservationForm-submitting', () => false);
  const submitError = useState<string | null>('reservationForm-submitError', () => null);
  const submitSuccess = useState('reservationForm-submitSuccess', () => false);

  /**
   * Submit a new reservation
   */
  const submitReservation = async (formData: CreateReservationDto) => {
    try {
      submitting.value = true;
      resetSubmissionState();

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
    console.log('Resetting submission state');
    submitError.value = null;
    submitSuccess.value = false;
  };

  return {
    // Submission state
    submitting: readonly(submitting),
    submitError: readonly(submitError),
    submitSuccess: readonly(submitSuccess),

    // Actions
    submitReservation,
    resetSubmissionState,
  };
};
