export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading.value) {
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }

  if (to.path === '/mon-compte' || to.path === '/login') {
    return;
  }

  const { getUser, isProfileComplete } = useUser();

  try {
    const user = await getUser();
    if (!isProfileComplete(user)) {
      return navigateTo('/mon-compte');
    }
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return navigateTo('/mon-compte');
  }
});
