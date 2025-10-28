// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    // Options
  },
  runtimeConfig: {
    public: {
      auth0Domain: "biplace-duckparapente.eu.auth0.com",
      auth0ClientId: process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID
    }
  }
})
