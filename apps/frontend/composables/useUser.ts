import { z } from 'zod';

import type { User, UserFormData, ValidationErrors } from '~/types/user';
import { userFormSchema } from '~/types/user';

export const useUser = () => {
  const { callApi } = useApi();

  /**
   * Fetch the current user's data
   */
  const getUser = async (): Promise<User> => {
    try {
      const user = await callApi<User>('/user/me');
      return user;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Impossible de charger les données utilisateur',
      );
    }
  };

  /**
   * Update the current user's data
   */
  const updateUser = async (userData: UserFormData): Promise<void> => {
    try {
      await callApi('/user/update', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Impossible de mettre à jour les informations',
      );
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
    getUser,
    updateUser,
    validateUserForm,
  };
};
