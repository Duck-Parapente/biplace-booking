import type { UserDto } from 'shared';
import { z } from 'zod';

import { userFormSchema, type UserFormData, type ValidationErrors } from '~/types/user';

export const useUser = () => {
  const { callApi } = useApi();

  // State management
  const userData = useState<UserDto | null>('userData', () => null);
  const users = useState<UserDto[]>('users', () => []);
  const loading = useState<boolean>('userLoading', () => false);
  const error = useState<string | null>('userError', () => null);
  const updating = useState<boolean>('userUpdating', () => false);
  const updateError = useState<string | null>('userUpdateError', () => null);
  const updateSuccess = useState<boolean>('userUpdateSuccess', () => false);

  /**
   * Fetch the current user's data
   */
  const getUser = async (): Promise<UserDto> => {
    try {
      loading.value = true;
      error.value = null;
      const user = await callApi<UserDto>('/user/me');
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
   * Fetch all users
   */
  const getUsers = async (): Promise<UserDto[]> => {
    try {
      const fetchedUsers = await callApi<UserDto[]>('/users');
      users.value = fetchedUsers;
      return fetchedUsers;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de charger la liste des utilisateurs';
      console.error('Failed to fetch users:', err);
      throw new Error(errorMessage);
    }
  };

  /**
   * Check if the user's profile is complete
   */
  const isProfileComplete = (user: UserDto | null | undefined): boolean => {
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
    users,
    loading,
    error,
    updating,
    updateError,
    updateSuccess,
    // Methods
    getUser,
    getUsers,
    updateUser,
    validateUserForm,
    isProfileComplete,
  };
};
