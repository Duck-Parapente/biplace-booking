export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading.value) {
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
