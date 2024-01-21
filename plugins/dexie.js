/*
 * @file:    \plugins\dexie.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th November 2023
 * Modified: Sat Jan 20 2024
 */

import Dexie from 'dexie'
import { importDB, exportDB, importInto, peakImportFile } from 'dexie-export-import'
import { DexieInstaller } from '~/utils/dexieInstaller'

//+-------------------------------------------------
// Initialize stores
// Ref: https://dexie.org/docs/Version/Version.stores()
//+-------------------------------------------------
const db = new Dexie('backlog.rip')

db.version(10).stores({
  // User stores
  account: 'uuid,steam',
  config: '&key,value',

  // Database stores
  games: '&uuid,api_id,steam_id,name',
  buffer: '&uuid',

  // Userdata related stores
  states: '++id,order,name',
  journal: '++id,event,ref,created_at',
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
  // log('Using Dexie v' + Dexie.semVer)

  const install = new DexieInstaller(db)

  install.account()
  install.checkin()

  install.states()
  install.journal()
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

// async function exportDB() {
//   let data = {
//     account: await db.account.toArray(),
//     config: await db.config.toArray(),
//     games: await db.games.toArray(),
//     states: await db.states.toArray(),
//     journal: await db.journal.toArray(),
//   }
//   console.log(data)
// }

//+-------------------------------------------------
// Define Nuxt plugin
// $db and window.$db
// -----
// Created on Tue Nov 28 2023
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  window.$db = db
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
