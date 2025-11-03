import { useAuth0 } from '@auth0/auth0-vue';

export interface UseAuth {
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: Ref<boolean>;
  user: Ref<{ name?: string } | undefined>;
  isLoading: Ref<boolean>;
  getAccessToken: () => Promise<string>;
}

export const useAuth = (): UseAuth => {
  const {
    loginWithRedirect: login,
    logout,
    isAuthenticated,
    user,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const getAccessToken = async (): Promise<string> => {
    return await getAccessTokenSilently();
  };

  return { login, logout, isAuthenticated, user, isLoading, getAccessToken };
};
