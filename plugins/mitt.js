/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Sun Jan 07 2024
 */

//+-------------------------------------------------
// Codex: List of events
// ⚡ game:modal
// ⚡ game:manager
//
// ⚡ state:change
//
// ⚡ backdrop:open
//
// ⚡ confirm:show
//
// ⚡ app.render
//
// ⚡ data:ready
// ⚡ data:updated
//
//+-------------------------------------------------

import mitt from 'mitt'

export default defineNuxtPlugin(() => {
  const emitter = mitt()
  window.$mitt = emitter

  emitter.on('event', (e) => {
    console.log('event', e)
    console.log(emitter.all())
  })

  return {
    provide: {
      mitt: emitter,
    },
  }
})
