/*
 * @file:    \nuxt.config.ts
 * @desc:    https://nuxt.com/docs/api/configuration/nuxt-config
 *           https://nitro.unjs.io/deploy/providers/cloudflare
 *           https://neon.tech/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: 24th December 2025 - 18:10:28
 */

import { defineNuxtConfig } from 'nuxt/config'

// import vuetify from 'vite-plugin-vuetify'
// import { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-08-15',
  ssr: true,

  nitro: {
    // preset: 'static'
    // preset: 'cloudflare-pages',
    preset: process.env.NODE_ENV === 'development' ? undefined : 'cloudflare-pages',

    prerender: {
      routes: ['/docs', '/sitemap', '/changelog'], //  '/changelog/v0.20'
      crawlLinks: true,
      // failOnError: false
    },

    logLevel: 'verbose', // 'info'  // 'debug'
  },

  routeRules: {
    '/docs': { prerender: true },
    '/sitemap': { prerender: true },
    '/changelog': { prerender: true },
    '/changelog/**': { prerender: true },
  },

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
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/devtools',
    '@pinia/nuxt',
    '@vueuse/nuxt',

    'vue-sonner/nuxt',
    'vuetify-nuxt-module',
  ],

  // Auto import pinia stores
  imports: {
    autoImport: true,
    // injectAtEnd: true,

    dirs: ['./stores', './services'],
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
      'rxjs',
      'form-data',
      // 'vue-sonner',
      // 'vuetify'
    ],
  },

  runtimeConfig: {
    public: {
      built_at: process.env.BUILD_TIME || new Date().toISOString(),
    },
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        },
      },
    },
  },

  app: {
    head: {
      htmlAttrs: {
        'data-tabler': 'backlog',

        'data-bs-theme': 'dark',
        'data-bs-theme-base': 'zinc', // slate, gray, zinc, neutral, stone
      },

      bodyAttrs: {
        class: 'antialiased',
      },
    },
  },

  vuetify: {
    styles: { configFile: './assets/scss/settings.scss' },
    prefixComposables: true,
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

  webpack: {
    // extractCSS: true,
  },

  vite: {
    optimizeDeps: {
      include: ['vuedraggable'],
    },

    define: {
      'process.env.DEBUG': false,
    },

    css: {},

    plugins: [
      // {
      //   name: 'ignore-css-warnings',
      //   enforce: 'post',
      //   configResolved(config) {
      //     const originalWarn = config.logger.warn;
      //     config.logger.warn = (...args) => {
      //       if (typeof args[0] === 'string' && args[0].includes('@charset must precede all other statements')) {
      //         // Ignore the specific warning
      //         return;
      //       }
      //       // For all other warnings, call the original warn method
      //       originalWarn.apply(config.logger, args);
      //     };
      //   },
      // },
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

  eslint: {
    config: {
      standalone: false, // Esto permite que tu eslint.config.mjs funcione con Nuxt
    },
  },

  devtools: {
    enabled: true,

    vscode: {},
    timeline: {
      enabled: true,
    },
  },
})
