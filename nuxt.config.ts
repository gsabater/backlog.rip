/**
 * @project: backlog
 * @file:    \nuxt.config.ts
 * @desc:    https://nuxt.com/docs/api/configuration/nuxt-config
 *           https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified:
 */


// import { mapState } from "pinia";

export default defineNuxtConfig({
  // ssr: false,

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
    '@vueuse/nuxt',

    '@pinia/nuxt',
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

  css: ['@/assets/scss/main.scss', 'animate.css/animate.min.css'],

  build: {
    transpile: ['vue-sonner', 'rxjs'],
    // transpile: ['element-plus/es'],
  },

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

    // urls: async () => {
    //   const response = await fetch('https://api.backlog.rip/dev/sitemap')
    //   const urls = await response.json()
    //   console.warn('urls', urls)
    //   return urls
    // }
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

    // vue: {
    //   template: {
    //     compilerOptions: {
    //       isCustomElement: (tag) => ['ninja-keys'].includes(tag),
    //     },
    //   },
    // },
  },

  sourcemap: { server: false, client: true },

  devtools: {
    enabled: false,

    vscode: {},
    timeline: {
      enabled: false,
    },
  },
})
