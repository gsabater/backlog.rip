/*
 * @file:    /plugins/mod.community.client.js
 * @desc:    ...
 * -------------------------------------------
 * Files:
 * |- /stores/community
 *
 * Events:
 * -
 * -------------------------------------------
 * Created Date: 27th December 2025
 * Modified: 27th December 2025 - 16:19:03
 */

// Nuxt Plugin
// Created on Sat Dec 27 2025
//+-------------------------------------------------
export default defineNuxtPlugin(async (nuxtApp) => {
  let time = performance.now()
  let { $app, $mitt } = nuxtApp

  let $store = useCommunityStore()
  await $store.init()

  // Event handling
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // $mitt.on('state:changed', () => {
  //   $store.indexLibrary('all')
  // })
})
