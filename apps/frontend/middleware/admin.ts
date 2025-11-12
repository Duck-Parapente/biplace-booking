export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading.value) {
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }

  // Check if user has ADMIN role
  if (!hasRole(Roles.ADMIN)) {
    // Redirect to home if not admin
    return navigateTo('/');
  }
});
