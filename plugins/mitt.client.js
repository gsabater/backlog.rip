/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Thu 20 March 2025 - 15:11:23
 */

import synchronizationService from '../services/synchronizationService'

const emitter = mitt()

//+-------------------------------------------------
// Codex: List of events
// ⇢ Initial lifecycle
// |- app:start
//   |- aw $user.authenticate()
//   |- aw $data.init()
//   |- $list.init()
//   |- $state.init()
//   |- $search.init()
//   |- apiService.init()
// |- user:ready
//   |- $libs.init()
// |- app:ready
//   |- synchronizationService.sync()

//   |- $guild.ping() <- CHANGE TO EVENT on user:ready
//   |- $cloud.connect() <- CHANGE TO EVENT on user:ready
//
// NOTES: if a store or service need to be init but does not require of others or clients, just do it on server render
// after init, emit module:ready
// keep firing until all is ready
// importer.client.autosync fired by event
// add imoprter.client.autosync achievements
// until the library and achievements are not synced, do not sync cloud
//
//+-------------------------------------------------

import mitt from 'mitt'

let $nuxt = null
let $user = null
let $libs = null
let $data = null
let $game = null
let $guild = null
let $list = null
let $state = null
let $search = null

//+-------------------------------------------------
// handle()
// Handles some callbacks for mitt events
// -----
// Created on Thu Jan 30 2025
//+-------------------------------------------------
function handle(event, payload) {
  switch (event) {
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Application start
    // Calls for stores and services to initialize
    // This is the first event fired by mitt
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'app:start':
      $data ??= useDataStore()
      $user ??= useUserStore()
      $list ??= useListStore()
      $state ??= useStateStore()
      $search ??= useSearchStore()

      Promise.all([$data.init(), $list.init(), $state.init(), $user.authenticate()])
        .then(() => {
          $nuxt.$app.ready = true
          emitter.emit('app:ready')
        })
        .catch((error) => {
          console.error('Error initializing stores and services:', error)
        })

      $search.init()
      apiService.getApiStatus()
      break

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Application is ready
    // All major services are initialized and ready to be used
    // This event is listened by most components directly
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'app:ready':
      synchronizationService.sync()
      if (document?.body && $nuxt.$app.dev) document.body.classList.add('has-debug')
      break

    // User hooks
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'user:ready':
      // $guild ??= useGuildStore()
      $nuxt ??= useNuxtApp()
      $libs ??= useLibraryStore()

      $libs.init()
      $nuxt.$sync.connect()
      $nuxt.$app.has.push('user')
      break

    // Data hooks
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'data:ready':
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()

      $data.countLibrary()
      $nuxt.$app.has.push('data')
      break

    // Hook used by search to search again
    case 'data:updated':
      break

    case 'data:deleted':
      $data ??= useDataStore()
      $data.countLibrary()
      break

    // A game has been added to the library
    // Similar to data changes but specific to library or owned
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'library:added':
      $data ??= useDataStore()
      $data.countLibrary()
      break

    // A game has changed its state
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'state:change':
      $data ??= useDataStore()
      $state ??= useStateStore()

      $data.countLibrary()
      $state.indexLibrary('all')
      break

    // Cloud sync events
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'sync:done':
      // WIP
      // dataService.updateBatch(['empty', ':outdated'])
      break

    // Game events
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // case 'game:modal':
    //   break

    // Real time events
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'sb:message':
      console.log('Received message:', payload)
      break

    default:
      break
  }
}

export default defineNuxtPlugin(() => {
  window.$mitt = emitter

  emitter.on('*', (e, payload) => {
    handle(e, payload)

    const blacklist = ['app:start', 'user:ready', 'data:ready']
    if (blacklist.includes(e)) return
    // log('✨ ' + e, payload)
    console.info(`🔸 "${e}"`, payload)
  })

  return {
    provide: {
      mitt: emitter,
    },
  }
})
