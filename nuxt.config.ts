/**
 * @project: backlog
 * @file:    \nuxt.config.ts
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2022
 * Last Modified: Mon Nov 21 2022
 **/

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    shim: false
  },

  modules: [
    ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMRUpdate'] }],
  ],

  css: [
    '@tabler/core/dist/css/tabler.css',
    '@/assets/scss/main.scss'
  ],

  build: {
  },

  webpack: {
    extractCSS: true,
  },

  vite: {
    css: {
      // preprocessorOptions: {
      //   scss: {
      //     additionalData: '@use "@/assets/scss/main.scss" as *;'
      //   }
      // }
    }
  },
})
