import { defineNuxtConfig } from 'nuxt/config'
import packageJson from './package.json'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      version: packageJson.version
    }
  },
  // Enable necessary modules
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  srcDir: 'app',
  
  app: {
    head: {
      htmlAttrs: {
        class: 'dark'
      },
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Inter:wght@400;500;600&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' }
      ]
    }
  },

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
  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'ar', name: 'العربية', file: 'ar.json', dir: 'rtl' },
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'id', name: 'Indonesia', file: 'id.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' }
    ],
    defaultLocale: 'en',
    langDir: '../i18n/locales',
    lazy: true,
    strategy: 'no_prefix'
  },

  // Nitro preset for Vercel; /tool is fully client-side
  nitro: {
    preset: 'vercel'
  },

  vite: {
    optimizeDeps: {
      exclude: ['pdfjs-dist']
    }
  },

  routeRules: {
    '/tool': { ssr: false }
  },

  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-04-03'
})