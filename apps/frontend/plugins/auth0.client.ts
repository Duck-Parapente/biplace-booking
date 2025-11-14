import { createAuth0 } from '@auth0/auth0-vue';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  if (!config.public.auth0Domain || !config.public.auth0ClientId) return;
  nuxtApp.vueApp.use(
    createAuth0({
      domain: config.public.auth0Domain,
      clientId: config.public.auth0ClientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: config.public.auth0Audience,
      },
      cacheLocation: 'localstorage', // persist after refresh
      useRefreshTokens: true,
      useRefreshTokensFallback: true,
    }),
  );
});
