import { useAuth0 } from '@auth0/auth0-vue';

const DUCK_ROLES_CLAIM = 'biplace-duck-roles';
export enum Roles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export interface UseAuth {
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: Ref<boolean>;
  user: Ref<{ name?: string } | undefined>;
  isLoading: Ref<boolean>;
  getAccessToken: () => Promise<string>;
  hasRole: (role: Roles) => boolean;
}

export const useAuth = (): UseAuth => {
  const {
    loginWithRedirect: login,
    logout,
    isAuthenticated,
    user,
    isLoading,
    getAccessTokenSilently,
    idTokenClaims,
  } = useAuth0();

  const getAccessToken = async (): Promise<string> => {
    return await getAccessTokenSilently();
  };

  const hasRole = (role: string): boolean => {
    if (!isAuthenticated.value || !idTokenClaims.value) return false;

    try {
      const claims = idTokenClaims.value;
      const roles = claims[DUCK_ROLES_CLAIM];

      return roles?.includes(role) ?? false;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  return { login, logout, isAuthenticated, user, isLoading, getAccessToken, hasRole };
};
