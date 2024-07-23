/**
 * @project: backlog
 * @file:    \nuxt.config.ts
 * @desc:    https://nuxt.com/docs/api/configuration/nuxt-config
 *           https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified:
 */

import { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-07-04',

  // ssr: false,
  sourcemap: { server: false, client: true },

  features: {
    devLogs: false,
  },

  experimental: {
    payloadExtraction: false,
  },

  typescript: {
    shim: false,
  },

  // auto import components
  components: true,

  modules: [
    // '@nuxt/image',
    '@nuxt/content',
    '@nuxt/devtools',
    '@nuxtjs/seo',
    // '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',

    // ['@pinia/nuxt', {
    //   autoImports: ['defineStore', 'mapStores', 'acceptHMRUpdate']
    // }],
  ],

  // Auto import pinia stores
  imports: {
    dirs: ['./stores'],
    presets: [
      {
        from: 'pinia',
        imports: ['mapStores', 'mapState'], // ['defineStore', 'mapStores', 'acceptHMRUpdate'],
      },
    ],
  },

  css: [
    //'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '@/assets/scss/main.scss',
  ],
  // 'animate.css/animate.min.css'

  build: {
    transpile: ['vue-sonner', 'rxjs', 'vuetify'],
  },

  // supabase: {
  //   redirect: false,
  // },

  content: {
    // ... options
  },

  app: {
    head: {
      bodyAttrs: {
        'class': 'antialiased',
        'data-bs-theme': 'dark',
      },
    },
  },

  //+-------------------------------------------------
  // Seo Modules and configuration
  //+-------------------------------------------------
  site: {
    url: 'https://backlog.rip',
    name: 'Backlog.rip',
    description: 'Free and open source library manager for all your games.',
    defaultLocale: 'en', // not needed if you have @nuxtjs/i18n installed
  },

  // ogImage: {
  //   enabled: false
  // },
  sitemap: {
    enabled: true,
    exclude: ['/tabler*', '/account/**', '/dev/**'],
    cacheMaxAgeSeconds: 3600 * 24,

    sources: [
      // fetch from an unauthenticated endpoint
      'https://api.backlog.rip/dev/sitemap',
    ],
  },

  // robots: {
  //   enabled: false
  // },

  // seoExperiments: {
  //   enabled: false
  // },

  schemaOrg: {
    enabled: true,
  },

  // linkChecker: {
  //   enabled: false
  // },

  webpack: {
    extractCSS: true,
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },

    css: {},

    plugins: [],

    vue: {
      template: {
        transformAssetUrls,
        // compilerOptions: {
        //   isCustomElement: (tag) => ['ninja-keys'].includes(tag),
        // },
      },
    },
  },

  // nitro: {
  //   preset: 'static',
  // },

  devtools: {
    enabled: false,

    vscode: {},
    timeline: {
      enabled: false,
    },
  },
})
