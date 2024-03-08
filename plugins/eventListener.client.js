/*
 * @file:    \plugins\eventListener.client.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 22nd February 2024
 * Modified: Tue Mar 05 2024
 */

import { reactive } from 'vue'

let $nuxt = null
let events = {
  'game-manager': {
    element: '.game-manager',
    enabled: false,
    emit: 'game:manager',
    payload: 'uuid',
  },
}

async function met() {}

async function init() {
  if (!$nuxt) $nuxt = useNuxtApp()
  log('🔅 listening to events')

  document.addEventListener('contextmenu', function (event) {
    console.log('Right-clicked ', event)

    let trigger = event.target.closest('.card-game')
    let attr = trigger?.getAttribute('uuid') || null

    if (trigger && attr) {
      console.log('Right-clicked on an element with class ".card-game"')

      $nuxt.$mitt.emit('game:manager', {
        $ev: event,
        app: attr,
      })

      event.preventDefault()
    }
  })
}

export default defineNuxtPlugin(() => {
  init()

  events = reactive({
    met: met,
    ...events,
  })

  window.$events = events
  return {
    provide: {
      events,
    },
  }
})
