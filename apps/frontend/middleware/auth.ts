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

  // Check localStorage cache first
  const CACHE_KEY = 'profile_complete_check';
  const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

  const cachedCheck = localStorage.getItem(CACHE_KEY);
  if (cachedCheck) {
    try {
      const { timestamp, isComplete } = JSON.parse(cachedCheck);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (!isExpired && isComplete) {
        return;
      }
    } catch (e) {
      console.warn('Invalid cache data for profile completion check:', e);
      localStorage.removeItem(CACHE_KEY);
    }
  }

  try {
    const user = await getUser();
    const profileComplete = isProfileComplete(user);

    // Cache the result
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        isComplete: profileComplete,
      }),
    );

    if (!profileComplete) {
      return navigateTo('/mon-compte');
    }
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return navigateTo('/mon-compte');
  }
});
