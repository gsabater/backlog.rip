/*
 * @file:    \plugins\dexie.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th November 2023
 * Modified: Sat Nov 25 2023
 */

import Dexie from 'dexie'

//+-------------------------------------------------
// Initialize stores
// Ref: https://dexie.org/docs/Version/Version.stores()
//+-------------------------------------------------
const db = new Dexie('backlog.rip')

db.version(4).stores({
  // User stores
  account: 'uuid,steam',
  config: '&key,value',

  // Database stores
  games: '&uuid,api_id,steam_id,name',
})

function check() {
  if (!window.indexedDB) {
    log('💽 ❌ IndexedDB is not supported')
    return
  }

  log('💽 ✅ IndexedDB is supported')
}

//+-------------------------------------------------
// init()
// Check that indexxeddb is supported (it should be)
// set a few values in the config store
// and expose db to window
// -----
// Created on Thu Nov 09 2023
//+-------------------------------------------------
function init() {
  if (check() === false) return

  window.$db = db
  log('Using Dexie v' + Dexie.semVer)

  db.config.count().then((count) => {
    if (count === 0) {
      db.config.put({
        key: 'created_at',
        value: new Date().toISOString().replace('T', ' ').substring(0, 19),
      })
    }
  })

  db.config
    .put({
      key: 'updated_at',
      value: new Date().toISOString().replace('T', ' ').substring(0, 19),
    })
    .catch((err) => {
      console.error(`Error: ${err.stack}`)
    })
}

//+-------------------------------------------------
// getValue()
// 🤷‍♀️ IDK if this exists
// -----
// Created on Thu Nov 09 2023
//+-------------------------------------------------
async function getValue(store, key) {
  let data = await db[store].get(key)
  if (data && data.value) return data.value
  return null
}

export default defineNuxtPlugin((nuxtApp) => {
  init()

  // extend dexie
  db.get = getValue
  db.value = getValue

  return {
    provide: {
      db,
    },
  }
})
