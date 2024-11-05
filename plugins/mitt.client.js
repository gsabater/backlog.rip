/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Wed 30 October 2024 - 17:50:38
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
// ✨ confirm:show
//
// ✨ app.render
//
// ✨ data:ready     <- Fired when datastore is ready and loaded
// ✨ data:updated   <- Fired when datastore is updated and has new data
//
//+-------------------------------------------------

import mitt from 'mitt'

export default defineNuxtPlugin(() => {
  const emitter = mitt()
  window.$mitt = emitter

  emitter.on('*', (e, payload) => {
    log('✨ ' + e, payload)
    // console.info(emitter.all)
  })

  return {
    provide: {
      mitt: emitter,
    },
  }
})
