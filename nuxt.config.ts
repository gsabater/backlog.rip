/*
 * @file:    \nuxt.config.ts
 * @desc:    https://nuxt.com/docs/api/configuration/nuxt-config
 *           https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
 *           https://nitro.unjs.io/deploy/providers/cloudflare
 *           https://neon.tech/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: 25th June 2025 - 10:37:08
 */

import { defineNuxtConfig } from 'nuxt/config';

// import vuetify from 'vite-plugin-vuetify'
// import { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-08-15',
  ssr: true,

  nitro: {
    // preset: 'static'
    // preset: 'cloudflare-pages',

    prerender: {
      routes: ['/docs', '/sitemap', '/changelog'],
      crawlLinks: true,
      // failOnError: false
    },

    logLevel: 'info'  // 'debug'
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
    '@nuxt/content',
    '@nuxt/devtools',
    // '@nuxtjs/seo',
    '@pinia/nuxt',
    '@vueuse/nuxt',

    'vue-sonner/nuxt',
    'vuetify-nuxt-module'
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
      // 'vue-sonner',
      // 'vuetify'
    ],
  },

  runtimeConfig: {
    public: {
      built_at: process.env.BUILD_TIME || new Date().toISOString(),
    }
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        }
      }
    }
  },

  app: {
    head: {
      htmlAttrs: {
        'data-tabler': 'backlog',

        'data-bs-theme': 'dark',
        'data-bs-theme-base': 'zinc', // slate, gray, zinc, neutral, stone
      },

      bodyAttrs: {
        'class': 'antialiased',
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

  devtools: {
    enabled: false,

    vscode: {},
    timeline: {
      enabled: true,
    },
  },
})
