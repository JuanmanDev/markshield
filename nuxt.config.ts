import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Enable necessary modules
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  srcDir: 'app',
  
  // Build configuration
  build: {
    transpile: ['@nuxt/ui']
  },
  
  // CSS configuration
  css: [
    '~/assets/styles/main.css'
  ],
  
  // Devtools
  devtools: {
    enabled: true
  },
  future: {
    compatibilityVersion: 4
  }
})