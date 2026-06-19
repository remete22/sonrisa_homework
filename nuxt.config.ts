// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? '',
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxtjs/eslint-module',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@prisma/nuxt',
    'shadcn-nuxt',
  ],
})