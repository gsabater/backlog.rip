/*
 * @file:    \plugins\mod.state.client.js
 * @desc:    The state plugin
 * -------------------------------------------
 * Files:
 * |- /components/b/State
 * |- /components/b/StatesMenu
 * |- /components/state/CrudDialog
 * |- /pages/account/sections/state
 * |- /stores/state
 *
 * Events:
 * - state:created ⇢ A state has been created
 * - state:updated ⇢ A state has been updated
 * - state:deleted ⇢ A state has been deleted
 * - ✅ state:changed ⇢ A game state has changed (played, completed, etc)
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 24th November 2025 - 05:01:49
 */

// Nuxt Plugin
// Created on Thu Oct 02 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  let time = performance.now()
  let { $app, $mitt } = nuxtApp

  let $store = useStateStore()
  $store.init()

  // Register and provide the app object to Nuxt
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // nuxtApp.provide('states')

  // Event handling
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('db:ready', () => {
    $store.load('init')
    $app.register('states', time)
  })

  $mitt.on('state:created', () => {
    $store.load('reload')
  })

  $mitt.on('state:updated', () => {
    $store.load('reload')
    //   queueService.queue('states', 'cloud')
  })

  $mitt.on('state:deleted', () => {
    $store.load('reload')
    //   queueService.queue('states', 'cloud')
  })

  $mitt.on('backup:restored', () => {
    $store.load('reload')
  })

  // No longer used
  // $mitt.on('state:changed', () => {
  //   $store.indexLibrary('all')
  // })
})
