/*
 * @file:    \plugins\zapp.client.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 27th February 2024
 * Modified: Tue Feb 27 2024
 */

let $nuxt = null

async function initApp() {
  if (!$nuxt) $nuxt = useNuxtApp()
  // await $nuxt.$app.init()
  window.$app = $nuxt.$app
}

export default defineNuxtPlugin({
  name: 'App initializer',
  async setup() {},

  hooks: {
    'app:mounted'() {
      // console.warn('xxx')
      initApp()
    },
  },

  env: {
    // Set this value to `false` if you don't want the plugin to run when rendering server-only or island components.
    islands: false,
  },
})
