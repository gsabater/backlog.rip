/*
 * @file:    \plugins\mod.list.client.js
 * @desc:    The list plugin
 * -------------------------------------------
 * Files:
 * |- /components/list
 * |- /components/list/crudDialog
 * |- /pages/my/list/[slug]
 * |- /pages/@user/list/[slug]
 * |- /pages/account/sections/lists
 * |- /stores/list
 *
 * Events:
 * |- list:create   ⇢ Event to show crud dialog
 * |- list:edit     ⇢ Event to show crud dialog with an item as payload
 * |- list:delete   ⇢ Confirmation that an item must be deleted
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 29th January 2026 - 17:17:08
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
