/*
 * @file:    \plugins\dexie.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th November 2023
 * Modified: Tue Nov 28 2023
 */

import Dexie from 'dexie'
import { DexieInstaller } from '~/utils/dexieInstaller'

//+-------------------------------------------------
// Initialize stores
// Ref: https://dexie.org/docs/Version/Version.stores()
//+-------------------------------------------------
const db = new Dexie('backlog.rip')

db.version(5).stores({
  // User stores
  account: 'uuid,steam',
  config: '&key,value',

  // Database stores
  games: '&uuid,api_id,steam_id,name',
  states: '&id,order,name',
})

function check() {
  if (!window.indexedDB) {
    log('💽 ❌ IndexedDB is not supported')
    return
  }

  log('💽 ✅ IndexedDB is supported')
}

//+-------------------------------------------------
// initialize()
// Check that indexxeddb is supported (it should be)
// set a few values in the config store
// and expose db to window
// -----
// Created on Thu Nov 09 2023
// Updated on Tue Nov 28 2023
//+-------------------------------------------------

function initialize() {
  if (check() === false) return

  window.$db = db
  log('Using Dexie v' + Dexie.semVer)

  const install = new DexieInstaller(db)

  install.states()
  install.checkin()
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

//+-------------------------------------------------
// Define Nuxt plugin
// $db and window.$db
// -----
// Created on Tue Nov 28 2023
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  initialize()

  // extend dexie
  db.get = getValue
  db.value = getValue

  return {
    provide: {
      db,
    },
  }
})
