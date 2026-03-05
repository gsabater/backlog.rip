/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: 4th March 2026 - 17:38:19
 */

import mitt from 'mitt'
const emitter = mitt()

// Nuxt Plugin
// Created on 13th March 2023
//+-------------------------------------------------
export default defineNuxtPlugin(() => {
  window.$mitt = emitter

  emitter.on('*', (e, payload) => {
    if (e == 'game:manager') return

    console.debug(`△ "${e}"`, payload ?? null)
  })

  return {
    provide: {
      mitt: emitter,
    },
  }
})
