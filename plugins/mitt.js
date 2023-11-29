/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Wed Nov 29 2023
 */

import mitt from 'mitt'

export default defineNuxtPlugin((nuxtApp) => {
  const emitter = mitt()
  window.$mitt = emitter

  emitter.on('event', (e) => {
    console.log('event', e)
    console.log(emitter.all())
  })

  return {
    provide: {
      mitt: emitter,
      // on: emitter.on, // Will register a listener for an event
      // emit: emitter.emit, // Will emit an event
      // all: emitter.all,

      // event: emitter.emit, // Will emit an event
      // listen: emitter.on, // Will register a listener for an event
    },
  }
})
