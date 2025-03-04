/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Sun 02 March 2025 - 11:01:15
 */

//+-------------------------------------------------
// Codex: List of events
// ⇢ Initial lifecycle
// |- $app.initClient() , on mounted from default layout
//   |- $user.authenticate()
//   |- $guild.ping() <- CHANGE TO EVENT on user:ready
//   |- $data.init()
//   |- apiService.init() <- CHANGE TO EVENT on data:ready
//   |- $integration.init() <- CHANGE TO EVENT on user:ready
//   |- $state.init() <- remove this.indexlibrary and make it an event on data:ready. no need to await anything
//   |- $list.init() <- no need to await anything
//   |- $cloud.connect() <- CHANGE TO EVENT on user:ready
//+-------------------------------------------------

import mitt from 'mitt'

let $data = null
let $game = null
let $state = null

//+-------------------------------------------------
// handle()
// Handles some callbacks for mitt events
// -----
// Created on Thu Jan 30 2025
//+-------------------------------------------------
function handle(event, payload) {
  switch (event) {
    // Application hooks
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'data:ready':
      $data ??= useDataStore()
      $data.countLibrary()
      break

    // Hook used by search to search again
    case 'data:updated':
      break

    // A game has been added to the library
    // Similar to data changes but specific to library or owned
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'library:added':
      debugger
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
      // dataService.updateBatch(['empty', ':outdated'])
      break

    // Game events
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // case 'game:modal':
    //   break

    default:
      break
  }
}

export default defineNuxtPlugin(() => {
  const emitter = mitt()
  window.$mitt = emitter

  emitter.on('*', (e, payload) => {
    handle(e, payload)
    log('✨ ' + e, payload)
  })

  return {
    provide: {
      mitt: emitter,
    },
  }
})
