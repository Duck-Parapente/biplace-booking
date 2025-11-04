import { z } from 'zod';

import type { User, UserFormData, ValidationErrors } from '~/types/user';
import { userFormSchema } from '~/types/user';

export const useUser = () => {
  const { callApi } = useApi();

  // State management
  const userData = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const updating = ref(false);
  const updateError = ref<string | null>(null);
  const updateSuccess = ref(false);

  /**
   * Fetch the current user's data
   */
  const getUser = async (): Promise<User> => {
    try {
      loading.value = true;
      error.value = null;
      const user = await callApi<User>('/user/me');
      userData.value = user;
      return user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de charger les données utilisateur';
      error.value = errorMessage;
      console.error('Failed to fetch user data:', err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Check if the user's profile is complete
   */
  const isProfileComplete = (user: User | null | undefined): boolean => {
    if (!user) return false;
    return !!(
      user.firstName &&
      user.lastName &&
      user.address &&
      user.phoneNumber &&
      user.firstName.trim() !== '' &&
      user.lastName.trim() !== '' &&
      user.address.trim() !== '' &&
      user.phoneNumber.trim() !== ''
    );
  };

  /**
   * Update the current user's data
   */
  const updateUser = async (userData: UserFormData): Promise<void> => {
    try {
      updating.value = true;
      updateError.value = null;
      updateSuccess.value = false;

      await callApi('/user/me', {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });

      updateSuccess.value = true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de mettre à jour les informations';
      updateError.value = errorMessage;
      console.error('Failed to update user data:', err);
      throw new Error(errorMessage);
    } finally {
      updating.value = false;
    }
  };

  /**
   * Validate user form data
   */
  const validateUserForm = (
    formData: UserFormData,
  ): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
    };

    try {
      userFormSchema.parse(formData);
      return { isValid: true, errors };
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ValidationErrors;
          if (field in errors) {
            errors[field] = issue.message;
          }
        });
      }
      return { isValid: false, errors };
    }
  };

  return {
    // State
    userData,
    loading,
    error,
    updating,
    updateError,
    updateSuccess,
    // Methods
    getUser,
    updateUser,
    validateUserForm,
    isProfileComplete,
  };
};
