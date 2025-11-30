/*
 * @file:    \plugins\zapp.client.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 27th February 2024
 * Modified: 30th September 2025 - 11:05:18
 */

export default defineNuxtPlugin({
  name: 'App initializer',
  async setup() {},

  hooks: {
    'app:mounted'() {
      const nuxtApp = useNuxtApp()

      // Boot the app on the mounted hook
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      nuxtApp.$app.init()

      // Expose the app and nuxt instances to the window
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (window && !window.$app) window.$app = nuxtApp.$app
      if (window && !window.$nuxt) window.$nuxt = nuxtApp
    },
  },

  env: {
    // Set this value to `false` if you don't want the plugin
    //  to run when rendering server-only or island components.
    islands: false,
  },
})
