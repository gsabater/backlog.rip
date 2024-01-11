/**
 * @project: backlog
 * @file:    \nuxt.config.ts
 * @desc:    https://nuxt.com/docs/api/configuration/nuxt-config
 *           https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
 * -------------------------------------------
 * Created Date: 16th November 2022
 * Modified:
 */

import { mapState } from "pinia";

export default defineNuxtConfig({
  ssr: false,

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

    '@pinia/nuxt',
    // 'nuxt-sanctum-auth',
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
    // '@tabler/core/dist/css/tabler.css', <-- imported via scss
    '@/assets/scss/main.scss',
  ],


  build: {
    transpile: ['vue-sonner']
    // transpile: ['element-plus/es'],
  },

  content: {
    // ... options
  },

  webpack: {
    extractCSS: true,
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },

    css: {},

    plugins: [],
  },

  sourcemap: { server: false, client: false },

  devtools: {
    enabled: true,
    // VS Code Server options
    vscode: {},

    timeline: {
      enabled: true,
    },
  },
})
