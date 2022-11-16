/**
 * @project: backlog
 * @file:    \nuxt.config.ts
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2022
 * Last Modified: Wed Nov 16 2022
 **/



// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({



  typescript: {
    shim: false
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/_colors.scss" as *;'
        }
      }
    }
  },

  modules: [

  ],

})
