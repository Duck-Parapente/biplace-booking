import type { UserDto } from 'shared';

export const useUserHelpers = () => {
  const getUserDisplayName = (user: UserDto | undefined | null): string | null => {
    if (!user) return null;
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  return {
    getUserDisplayName,
  };
};
