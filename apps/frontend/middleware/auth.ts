export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading.value) {
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }

  // Skip profile completion check for /mon-compte and /login
  if (to.path === '/mon-compte' || to.path === '/login') {
    return;
  }

  // Check if user profile is complete
  const { getUser, isProfileComplete } = useUser();

  try {
    const user = await getUser();
    if (!isProfileComplete(user)) {
      return navigateTo('/mon-compte');
    }
  } catch (error) {
    console.error('Error checking profile completion:', error);
    // If we can't fetch user data, redirect to profile page to be safe
    return navigateTo('/mon-compte');
  }
});
