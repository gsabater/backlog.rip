/*
 * @file:    \plugins\mod.data.client.js
 * @desc:    The data plugin
 * -------------------------------------------
 * Files:
 * |- /services/dataService
 * |- /stores/data
 *
 * Events:
 * |- ✅ data:ready ⇢ The data has been loaded and is ready
 * |- ✅ data:added ⇢ New data has been added
 * |- ✅ data:updated ⇢ The data has been updated (item added, removed, modified)
 * |- game:state:changed ⇢ A game state has changed (played, completed, etc)
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 24th November 2025 - 03:30:50
 */

import dataService from '../services/dataService'

// Nuxt Plugin
// Created on Tue Sep 30 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.$log('✨✅ [ Data ]')

  let time = performance.now()
  let { $app, $mitt } = nuxtApp

  let $store = useDataStore()
  let $library = useLibraryStore()

  // Register and provide the app object to Nuxt
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // nuxtApp.provide('data', plugin)

  // Event handling
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('db:ready', () => {
    $store.init()
    dataService.init()

    $app.register('data', time)
  })

  $mitt.on('data:ready', () => {
    // console.warn('event data:ready received')
    $store.countLibrary()
  })

  $mitt.on('user:ready', () => {
    $library.init()
  })

  $mitt.on('user:login', () => {
    $library.init()
  })

  // This does not make sense
  // since countLibrary only counts items in data and library()
  // $mitt.on('state:changed', () => {
  // $store.countLibrary()
  // })

  // A game has been added to the library
  // Similar to data changes but specific to library or owned
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('library:added', () => {
    console.warn('🔥 WIP FROM MITT, maybe rename to game:added')
    console.warn('event library:added received')
    $store.countLibrary()
  })
})
