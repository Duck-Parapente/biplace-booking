import { UserRoles } from 'shared';

export default defineNuxtRouteMiddleware(async () => {
  const { isLoading, hasRole } = useAuth();

  if (isLoading.value) {
    return;
  }

  if (!hasRole(UserRoles.ADMIN)) {
    return navigateTo('/');
  }
});
