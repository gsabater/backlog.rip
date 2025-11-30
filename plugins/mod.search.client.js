/*
 * @file:    \plugins\mod.search.client.js
 * @desc:    The search plugin
 * -------------------------------------------
 * Files:
 * |- ...
 * |- /stores/search
 *
 * Events:
 * - search:end
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 11th October 2025 - 12:07:50
 */

let plugin = {
  store: null,
}

// Nuxt Plugin
// Created on Tue Sep 30 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.$log('✨ [ Search ]')

  plugin.store = useSearchStore()
  plugin.store.init()

  // Provide the app object to the Nuxt instance
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.provide('search', plugin)
})
