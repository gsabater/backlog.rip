/*
 * @file:    \nuxt.config.ts
 * @desc:    https://nuxt.com/docs/api/configuration/nuxt-config
 *           https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
 *           https://nitro.unjs.io/deploy/providers/cloudflare
 *           https://neon.tech/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: Mon 28 April 2025 - 17:12:24
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
      routes: ['/sitemap']
    }
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
    markdown: {
      remarkPlugins: [
        // Make sure you have something like "remark-container" here
        // and also define your container name if needed
      ]
    }
  },

  app: {
    head: {
      htmlAttrs: {
        'data-bs-theme': 'dark',
        'data-tabler': 'backlog',
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


  // sitemap: {
  //   enabled: false
  //   // // exclude all app sources
  //   // excludeAppSources: true,
  //   // cacheMaxAgeSeconds: 3600 * 24,

  //   // // Build time sitemap
  //   // urls: async () => {
  //   //   const urls = await fetch('https://api.backlog.rip/sitemap.xml')
  //   //   return urls
  //   // }

  //   // // Runtime sitemap
  //   // // sources: [
  //   // //   'https://api.backlog.rip/sitemap.xml',
  //   // // ],
  // },

  // robots: {
  //   enabled: false
  // },

  // seoExperiments: {
  //   enabled: false
  // },

  // schemaOrg: {
  //   enabled: true,
  // },

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
      enabled: false,
    },
  },
})
