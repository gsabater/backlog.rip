/*
 * @file:    \nuxt.config.ts
 * @desc:    https://nuxt.com/docs/api/configuration/nuxt-config
 *           https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
 *           https://nitro.unjs.io/deploy/providers/cloudflare
 *           https://neon.tech/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: Thu 12 September 2024 - 17:30:40
 */

// import vuetify from 'vite-plugin-vuetify'
// import { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: true,
  // nitro: {
  //   // preset: 'static'
  //   // preset: 'cloudflare-pages',
  // },

  compatibilityDate: '2024-09-01',
  sourcemap: { server: false, client: true },

  features: {
    devLogs: false,
    inlineStyles: false,
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
    '@pinia/nuxt',
    '@vueuse/nuxt',

    'vuetify-nuxt-module'
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
    // '@mdi/font/css/materialdesignicons.min.css',
    '@/assets/scss/main.scss',
  ],
  // 'animate.css/animate.min.css'

  build: {
    transpile: [
      'vue-sonner',
      'rxjs',
      // 'vuetify'
    ],
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

  vuetify: {
    moduleOptions: {
      styles: { configFile: './assets/scss/settings.scss' },
    },
    vuetifyOptions: './vuetify.config.js',
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

  ogImage: { enabled: false },

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
    // extractCSS: true,
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },

    css: {},

    plugins: [
      {
        name: 'ignore-css-warnings',
        enforce: 'post',
        configResolved(config) {
          const originalWarn = config.logger.warn;
          config.logger.warn = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('@charset must precede all other statements')) {
              // Ignore the specific warning
              return;
            }
            // For all other warnings, call the original warn method
            originalWarn.apply(config.logger, args);
          };
        },
      },
    ],

    vue: {
      template: {
        // transformAssetUrls,
        // compilerOptions: {
        //   isCustomElement: (tag) => ['ninja-keys'].includes(tag),
        // },
      },
    },
  },

  devtools: {
    enabled: false,

    vscode: {},
    timeline: {
      enabled: false,
    },
  },
})
