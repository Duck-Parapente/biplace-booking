import { useAuth0 } from '@auth0/auth0-vue';

export interface UseAuth {
  login: () => Promise<void>;
  logout: (options?: any) => void;
  isAuthenticated: Ref<boolean>;
  user: Ref<any>;
  isLoading: Ref<boolean>;
  error: Ref<any>;
}

export const useAuth = (): UseAuth => {
  const { loginWithRedirect: login, logout, isAuthenticated, user, isLoading, error } = useAuth0();
  return { login, logout, isAuthenticated, user, isLoading, error };
};
