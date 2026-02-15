import type { UserDto } from 'shared';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  INACTIVE = 'INACTIVE',
}

export const useUserStatus = () => {
  const getStatus = (user: UserDto): UserStatus => {
    const isExpired = user.activeUntil && new Date(user.activeUntil) < new Date();

    if (!user.isActive) {
      return UserStatus.INACTIVE;
    }

    if (isExpired) {
      return UserStatus.EXPIRED;
    }

    return UserStatus.ACTIVE;
  };

  const getDisplay = (user: UserDto) => {
    const status = getStatus(user);

    if (status === UserStatus.INACTIVE) {
      return {
        status,
        badgeClasses:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200',
        dotClasses: 'w-1.5 h-1.5 rounded-full bg-red-600',
        label: 'Inactif',
        borderColor: 'border-red-400',
      };
    }

    if (status === UserStatus.EXPIRED) {
      return {
        status,
        badgeClasses:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200',
        dotClasses: 'w-1.5 h-1.5 rounded-full bg-yellow-600',
        label: 'Expiré',
        borderColor: 'border-yellow-400',
      };
    }

    return {
      status,
      badgeClasses:
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200',
      dotClasses: 'w-1.5 h-1.5 rounded-full bg-green-600',
      label: 'Actif',
      borderColor: 'border-green-400',
    };
  };

  return {
    getStatus,
    getDisplay,
  };
};
