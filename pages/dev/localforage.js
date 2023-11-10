/*
 * @file:    \plugins\localforage.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 4th November 2023
 * Modified: Wed Nov 08 2023
 */

import localforage from 'localforage'

var stores = {
  ready: false,

  config: localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: 'backlog.rip',
    storeName: 'config',
  }),

  games: localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: 'backlog.rip',
    storeName: 'games',
  }),
}

// https://web.dev/indexeddb/
function check() {
  if (!window.indexedDB) {
    // alert(
    //   "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    // )
    return
  }

  stores.ready = true
  log('✅ IndexedDB is supported')
}

export default defineNuxtPlugin((nuxtApp) => {
  // check()

  return {
    provide: {
      stores: stores,
      localforage: localforage,
    },
  }
})
