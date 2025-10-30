import posthog from 'posthog-js';

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost,
    defaults: '2025-05-24',
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    loaded: (posthog) => {
      if (import.meta.env.MODE === 'development') posthog.debug();
    },
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
