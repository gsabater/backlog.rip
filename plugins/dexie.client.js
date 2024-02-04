/* eslint-disable no-unused-vars */

/*
 * @file:    \plugins\dexie.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th November 2023
 * Modified: Sun Feb 04 2024
 */

import Dexie from 'dexie'
import Toolkit from '~/utils/dexieToolkit'
import { DexieInstaller } from '~/utils/dexieInstaller'
import { importDB, exportDB, importInto, peakImportFile } from 'dexie-export-import'

//+-------------------------------------------------
// Define stores
// Ref: https://dexie.org/docs/Version/Version.stores()
//+-------------------------------------------------

let db = new Dexie('backlog.rip')

let ver = 11
let sch = {
  account: 'uuid',
  config: '&key',
  games: '&uuid,api_id,steam_id',
  buffer: '&uuid',
  states: '++id,order,name',
  journal: '++id,event,ref',

  // Version 9
  // account: 'uuid,steam',
  // config: '&key,value',
  // games: '&uuid,api_id,steam_id,name',
  // states: '&id,order,name',
  // journal: '++id,event,ref,created_at',
}

// db.version(9).stores({
// })

db.version(ver).stores(sch)
db.open().catch(async (e) => {
  console.warn('checking database version ...')
  Toolkit.checkDeepVersion(db)
})

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
// install()
// Check that indexedDB is supported (it should be)
// Then set a few values to db
// -----
// Created on Thu Nov 09 2023
// Updated on Tue Nov 28 2023
//+-------------------------------------------------
function install() {
  if (check() === false) return
  log('Using Dexie v' + Dexie.semVer)

  let installer = new DexieInstaller(db)

  installer.account()
  installer.states()
  installer.checkin()
  installer.journal()

  db.status = 'ready'
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
  db.get = getValue
  db.value = getValue

  db.sch = sch
  db.ver = ver

  db.status = db.status || null
  window.$db = db

  install()

  return {
    provide: {
      db,
    },
  }
})
