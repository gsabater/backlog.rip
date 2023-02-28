/**
 * @project: backlog
 * @file:    \nuxt.config.ts
 * @desc:    https://nuxt.com/docs/api/configuration/nuxt-config
 *           https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
 * -------------------------------------------
 * Created Date: 16th November 2022
 * Last Modified: Fri Feb 24 2023
 **/

 import ElementPlus from 'unplugin-element-plus/vite'

export default defineNuxtConfig({
  ssr: false,

  typescript: {
    shim: false
  },

  modules: [
    ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMRUpdate'] }],
  ],

  // Auto import pinia stores
  imports: {
    dirs: ['./stores']
  },

  plugins: [
    // { src: "~/node_modules/@tabler/core/dist/js/tabler.js", mode: "client" }
  ],

  // auto import components
  components: true,

  css: [
    // '@tabler/core/dist/css/tabler.css', <-- imported via scss
    '@/assets/scss/main.scss'
  ],

  build: {
    transpile: ['element-plus/es'],
  },

  webpack: {
    extractCSS: true,
  },

  vite: {
    define: {
      // 'process.env.DEBUG': false,
    },
    css: {
    },
    plugins: [ElementPlus()],
  },
})
