/*
 * @file:    \plugins\dexie.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th November 2023
 * Modified: Fri Feb 02 2024
 */

import Dexie from 'dexie'
import { DexieInstaller } from '~/utils/dexieInstaller'
import Migrator from '~/utils/dexieMigrator'

import { importDB, exportDB, importInto, peakImportFile } from 'dexie-export-import'
//+-------------------------------------------------
// Initialize stores
// Ref: https://dexie.org/docs/Version/Version.stores()
//+-------------------------------------------------
let db = new Dexie('backlog.rip')
let schema = {
  account: 'uuid',
  config: '&key',

  games: '&uuid,api_id,steam_id',
  buffer: '&uuid',

  states: '++id,order,name',
  journal: '++id,event,ref',
}

await db.open()
if (db.verno == 9) {
  await Migrator.migrate9to10(db)
  db = await Migrator.restore(schema)
}

db.close()
db = new Dexie('backlog.rip')
db.version(11).stores(schema)

//+-------------------------------------------------
// check()
// Chec, if indexeddb is supported
// -----
// Created on Fri Feb 02 2024
//+-------------------------------------------------
function check() {
  if (!window.indexedDB) {
    log('💽 ❌ IndexedDB is not supported')
    return false
  }

  log('💽 IndexedDB is supported')
  return true
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
  log('Using Dexie v' + Dexie.semVer, db.verno)

  let installer = new DexieInstaller(db)
  installer.account()
  installer.checkin()

  installer.states()
  installer.journal()
}

//+-------------------------------------------------
// migrate()
// Moves data between tables
// -----
// Created on Fri Feb 02 2024
//+-------------------------------------------------
async function migrate(db, tables, action) {
  let backup = new Dexie('backlog.backup')

  let dest = action === 'backup' ? 'x_' : ''
  let source = action === 'backup' ? '' : 'x_'

  for (const storeName of tables) {
    try {
      const items = await db.table(`${source}${storeName}`).toArray()
      await db.table(`${dest}${storeName}`).bulkAdd(items)
    } catch (error) {
      console.error('Error migrating', storeName, error)
    }
  }
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
