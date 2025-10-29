import { useAuth0 } from '@auth0/auth0-vue';

export interface UseAuth {
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: Ref<boolean>;
  user: Ref<{ name?: string } | undefined>;
  isLoading: Ref<boolean>;
}

export const useAuth = (): UseAuth => {
  const { loginWithRedirect: login, logout, isAuthenticated, user, isLoading } = useAuth0();
  return { login, logout, isAuthenticated, user, isLoading };
};
