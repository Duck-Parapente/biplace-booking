import { useAuth0 } from '@auth0/auth0-vue';
import { DUCK_ROLES_CLAIM, UserRoles } from 'shared';

export interface UseAuth {
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: Ref<boolean>;
  user: Ref<{ name?: string } | undefined>;
  isLoading: Ref<boolean>;
  getAccessToken: () => Promise<string>;
  hasRole: (role: UserRoles) => boolean;
}

export const useAuth = (): UseAuth => {
  const config = useRuntimeConfig();

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
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: config.public.auth0Audience,
        },
      });
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const hasRole = (role: UserRoles): boolean => {
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
