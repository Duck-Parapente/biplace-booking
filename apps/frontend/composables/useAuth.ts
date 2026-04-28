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
  isAdmin: ComputedRef<boolean>;
  isAdminOrManager: ComputedRef<boolean>;
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
      // Silent auth fails on localhost when refresh token is expired (iframe blocked by third-party cookie restrictions).
      // Auth0 surfaces this as consent_required / login_required — redirect to login rather than surfacing a raw error.
      const recoverableErrors = ['consent_required', 'login_required', 'interaction_required'];
      if (
        error &&
        typeof error === 'object' &&
        'error' in error &&
        recoverableErrors.includes((error as { error: string }).error)
      ) {
        await login({
          authorizationParams: { audience: config.public.auth0Audience },
        });
        throw error; // unreachable — loginWithRedirect navigates away
      }
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

  const isAdmin = computed(() => hasRole(UserRoles.ADMIN));
  const isAdminOrManager = computed(() => hasRole(UserRoles.ADMIN) || hasRole(UserRoles.MANAGER));

  return {
    login,
    logout,
    isAuthenticated,
    user,
    isLoading,
    getAccessToken,
    hasRole,
    isAdmin,
    isAdminOrManager,
  };
};
