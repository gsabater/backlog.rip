/*
 * @file:    \plugins\mod.list.client.js
 * @desc:    The list plugin
 * -------------------------------------------
 * Files:
 * |- /components/list
 * |- /components/list/crudDialog
 * |- /pages/my/list
 * |- /pages/account/sections/lists
 * |- /stores/list
 *
 * Events:
 * |- list:create ⇢ Call to show crud dialog
 * |- list:edit ⇢ Call to show crud dialog with an item as payload
 * |- list:delete ⇢ Call to show delete dialog with an item
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 24th November 2025 - 04:36:16
 */

// Nuxt Plugin
// Created on Tue Sep 30 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  let time = performance.now()
  let { $app } = nuxtApp

  let $store = useListStore()

  // Event handling
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('db:ready', () => {
    $store.init()

    // Register and provide the app object to Nuxt
    $app.register('list', time)
  })
})
