/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Thu 30 January 2025 - 17:53:13
 */

//+-------------------------------------------------
// Codex: List of events
// ✨ search:palette
//
// ✨ game:modal
// ✨ game:manager
//
// ✨ state:change
//
// ✨ list:create
// ✨ list:edit
//
// ✨ ask:confirm
//
// ✨ app.render
//
// ✨ data:ready     <- Fired when datastore is ready and loaded
// ✨ data:updated   <- Fired when datastore is updated and has new data
//
//+-------------------------------------------------

import mitt from 'mitt'

let $data = null
let $game = null

//+-------------------------------------------------
// handle()
// Handles some callbacks for mitt events
// -----
// Created on Thu Jan 30 2025
//+-------------------------------------------------
function handle(event, payload) {
  switch (event) {
    // Library changes.
    // Similar to data changes but specific to library or owned
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'library:added':
      $data ??= useDataStore()
      $data.countLibrary()
      break

    // State events
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'state:change':
      $data ??= useDataStore()
      $game ??= useGameStore()

      $data.countLibrary()
      break

    // Cloud sync events
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'sync:done':
      dataService.updateBatch(['empty', ':outdated'])
      break

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
