import type { CreateReservationDto } from 'shared';

import { formatDate } from './useDateHelpers';
export type CreateReservationFormData = CreateReservationDto & { endDate: string };

function getDaysBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]!);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export const useReservationForm = () => {
  const { callApi } = useApi();

  // Submission state
  const submitting = useState('reservationForm-submitting', () => false);
  const submitError = useState<string | null>('reservationForm-submitError', () => null);
  const submitSuccess = useState('reservationForm-submitSuccess', () => false);

  /**
   * Submit reservations for each day from startingDate to endDate
   */
  const submitReservation = async (formData: CreateReservationDto & { endDate?: string }) => {
    try {
      submitting.value = true;
      resetSubmissionState();

      const { endDate, ...reservationData } = formData;
      const dates = getDaysBetween(formData.startingDate, endDate ?? formData.startingDate);

      for (const date of dates) {
        try {
          await callApi('/reservations', {
            method: 'POST',
            body: JSON.stringify({ ...reservationData, startingDate: date }),
          });
        } catch (err) {
          const baseMessage =
            err instanceof Error ? err.message : 'Impossible de créer la réservation';
          const cleanMessage = baseMessage.replace(/\.+$/, '');
          const errorMessage = `Erreur le ${formatDate(date)} : ${cleanMessage}. Les dates précédentes ont été créées.`;
          submitError.value = errorMessage;
          console.error(`Failed to create reservation for ${date}:`, err);
          throw err;
        }
      }

      submitSuccess.value = true;
    } catch (err) {
      if (!submitError.value) {
        const errorMessage =
          err instanceof Error ? err.message : 'Impossible de créer la réservation';
        submitError.value = errorMessage;
      }
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
