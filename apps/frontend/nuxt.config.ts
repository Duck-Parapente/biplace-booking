// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    public: {
      auth0Domain: 'biplace-duckparapente.eu.auth0.com',
      auth0ClientId: process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID,
      auth0Audience: process.env.NUXT_PUBLIC_AUTH0_AUDIENCE,
      backendDomain: process.env.NUXT_PUBLIC_BACKEND_BASE_URL,
    },
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    },
  },
});
