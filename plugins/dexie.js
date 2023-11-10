/*
 * @file:    \plugins\dexie.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th November 2023
 * Modified: Wed Nov 08 2023
 */

import Dexie from 'dexie'

//+-------------------------------------------------
// Initialize stores
// Ref: https://dexie.org/docs/Version/Version.stores()
//+-------------------------------------------------
const db = new Dexie('backlog.rip')

db.version(1).stores({
  config: ',key',
})

function check() {
  if (!window.indexedDB) {
    log('💽 ❌ IndexedDB is not supported')
    return
  }

  log('💽 ✅ IndexedDB is supported')
}

function init() {
  if (check() === false) return

  log('Using Dexie v' + Dexie.semVer)
  db.config
    .put({ key: 'updated_at', value: new Date().toISOString().replace('T', ' ').substring(0, 19) })
    .then((key) => {
      console.log(`Added config with key ${key}`)
    })
    .catch((err) => {
      console.error(`Error: ${err.stack}`)
    })

  // db.config
  //   .put({ key: 'updated_at', value: new Date().toISOString().replace('T', ' ').substring(0, 19) })
  //   .then((id) => {
  //     console.log(`Added friend with id ${id}`)
  //     db.config
  //       .where('key')
  //       .equals('updated_at')

  //       .each(function (user) {
  //         console.log('Found user: ', user)
  //       })
  //   })
  //   .catch((err) => {
  //     console.error(`Error: ${err.stack}`)
  //   })
}

export default defineNuxtPlugin((nuxtApp) => {
  init()
  return {
    provide: {
      db,
    },
  }
})
