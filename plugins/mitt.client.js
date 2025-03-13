/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Thu 13 March 2025 - 17:22:09
 */

//+-------------------------------------------------
// Codex: List of events
// ⇢ engine initialization
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
import queueService from '../services/queueService'

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
    case 'data:ready':
      $data ??= useDataStore()
      $data.countLibrary()
      break

    case 'data:updated':
      break

    case 'data:deleted':
      $data ??= useDataStore()
      $data.countLibrary()

      queueService.queue('library', 'cloud')
      break

    // A game has been added to the library
    // Similar to data changes but specific to library or owned
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'library:added':
      $data ??= useDataStore()
      $data.countLibrary()
      break

    // A game has changed its state
    case 'state:change':
      $data ??= useDataStore()
      $state ??= useStateStore()

      $data.countLibrary()
      $state.indexLibrary('all')
      break

    // A game dialog is opened
    // case 'game:modal':
    //   break

    // States have been changed
    case 'state:created':
    case 'state:updated':
    case 'state:deleted':
      $state ??= useStateStore()

      $state.load('reload')
      queueService.queue('states', 'cloud')
      break

    // The user data has been updated
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'config:updated':
    case 'account:updated':
      queueService.queue('account', 'cloud')
      break

    case 'sync:done':
      // dataService.updateBatch(['empty', ':outdated'])
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
