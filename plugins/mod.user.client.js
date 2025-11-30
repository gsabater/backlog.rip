/*
 * @file:    \plugins\mod.user.client.js
 * @desc:    The user plugin
 * -------------------------------------------
 * Files:
 * |- /stores/user
 * |- /services/integrationService
 *
 * Events:
 * |- ✅ user:ready ⇢ The user data has been loaded
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 24th November 2025 - 05:04:15
 */

let plugin = {
  config: reactive({}),
}

// Nuxt Plugin
// Created on Tue Sep 30 2025
//+-------------------------------------------------
export default defineNuxtPlugin(async (nuxtApp) => {
  let time = performance.now()
  let { $app } = nuxtApp

  let $store = useUserStore()
  await $store.init()

  plugin.config = $store.config
  if (document?.body && $app.dev) document.body.classList.add('has-debug')

  // Register and provide the app object to Nuxt
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.provide('user', plugin)

  // Event handling
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('db:ready', async () => {
    await $store.authenticate()
    $app.register('user', time)
  })

  // TODO: on user:ready, if config.dev is true, set app dev
})
