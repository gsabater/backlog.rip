/*
 * @file:    \plugins\indexedDB.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 4th November 2023
 * Modified: Wed Nov 08 2023
 */

import localforage from 'localforage'

var instance = null

var stores = {
  ready: false,
  supported: false,

  dbName: 'backlog.rip',
  config: null,
  recent: null,
}

function check() {
  if (!window.indexedDB) {
    log('💽 ❌ IndexedDB is not supported')
    return
  }

  stores.supported = true
  log('💽 ✅ IndexedDB is supported')
}

function createSchema() {
  stores.config = localforage.createInstance({
    name: stores.dbName,
    storeName: 'config',
    description: 'User configuration values',
  })

  instance = localforage.createInstance({
    name: stores.dbName,
    storeName: 'recent',
    description: 'USer recent activity',
  })

  log('💽 $idb schema created')
}

//+-------------------------------------------------
// init()
//
// -----
// Created on Wed Nov 08 2023
//+-------------------------------------------------
function init() {
  if (check() === false) return

  createSchema()

  stores.config.setItem('updated_at', new Date().toISOString().replace('T', ' ').substring(0, 19))
  stores.ready = true

  // let openRequest = indexedDB.open('backlog.rip', 1)

  // openRequest.onupgradeneeded = function () {
  //   // se dispara si el cliente no tiene la base de datos
  //   // ...ejecuta la inicialización...
  //   // db.createObjectStore(name[, keyOptions]);
  //   //   let db = openRequest.result;
  //   // if (!db.objectStoreNames.contains('books')) { // si no hay un almacén de libros ("books"),
  //   //   db.createObjectStore('books', {keyPath: 'id'}); // crearlo
  //   // }
  // }

  // openRequest.onerror = function () {
  //   console.error('Error', openRequest.error)
  // }

  // openRequest.onsuccess = function () {
  //   stores.db = openRequest.result
  //   stores.ready = true
  //   // continúa trabajando con la base de datos usando el objeto db
  // }

  // openRequest.onblocked = function () {
  //   // este evento no debería dispararse si hemos manejado onversionchange correctamente

  //   // significa que hay otra conexión abierta a la misma base
  //   // que no fue cerrada después de que se disparó db.onversionchange
  //   alert('blocker')
  // }
}

export default defineNuxtPlugin((nuxtApp) => {
  init()

  return {
    provide: {
      idb: {
        ...stores,
        instance: instance,
      },
    },
  }
})
