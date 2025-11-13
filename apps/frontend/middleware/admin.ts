import { UserRoles } from 'shared';

export default defineNuxtRouteMiddleware(async () => {
  const { isLoading, hasRole } = useAuth();

  if (isLoading.value) {
    return;
  }

  // Check if user has ADMIN role
  if (!hasRole(UserRoles.ADMIN)) {
    // Redirect to home if not admin
    return navigateTo('/');
  }
});
