export default defineNuxtRouteMiddleware(async () => {
  const { isLoading, isAdminOrManager } = useAuth();

  if (isLoading.value) return;
  if (isAdminOrManager.value) return;

  return navigateTo('/');
});
