/*
 * @file:    \plugins\importer.client.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 22nd January 2024
 * Modified: Tue May 07 2024
 */

import importer from '~/utils/importer'
// import Toast from '../components/toasts/Importing.vue'

//+-------------------------------------------------
// Importer plugin (_sync)
// Performs actions to scan, prepare and store a library
// Allows automatic and silent import of libraries
//+-------------------------------------------------

let $nuxt = null
let $toast = null

const _sync = {
  x: {
    log: null, // logger used to communicate with the layout
    source: null, // source currently running ('steam', 'gog'...)

    // From detect...
    module: null, // the module assigned to that source to run the import
    account: null, // The user account with userdata at the selected source

    // Scan and prepare...
    data: {},
    apps: {},

    // Error handling
    code: null, // profile:private, library:empty, etc
    status: null, // 'error', 'warning'
  },

  enabled: null,
  background: null,
}

//+-------------------------------------------------
// function()
// check if there is any source enabled in db.settings
// and perform a sync if so
// -----
// Created on Thu Jan 25 2024
//+-------------------------------------------------
async function autoSync() {
  let autosync_steam = $nuxt?.$auth?.config?.autosync_steam ?? false
  let last_sync = $nuxt?.$auth?.user?.steam_updated_at ?? null
  let hoursAgo = dates.hoursAgo(last_sync)

  if (!autosync_steam) {
    log('♾️ AutoSync cancelled - not enabled in settings', autosync_steam)
    return
  }

  if (hoursAgo < 24) {
    log('♾️ AutoSync cancelled - last sync was less than 24h ago', hoursAgo, last_sync)
    return
  }

  $nuxt.$app.updating = true

  await sync({
    platform: 'steam',
    background: true,
  })

  await delay(2000, true)
  log('✨ importer', 'scanAndPrepare()')
  const data = await scan()

  if (data.apps.toImport.length == 0 && data.apps.toUpdate.length == 0) {
    log('✨ importer', 'No games to import or update')

    $nuxt.$auth.local.steam_updated_at = dates.now()
    $nuxt.$auth.updateAccount('steam_updated_at')

    $nuxt.$app.updating = false
    return
  }

  store({
    notify: true,
    journal: true,
    apps: {
      toUpdate: data.apps.toUpdate,
      toImport: data.apps.toImport,
    },
  })

  await delay(5000, true)
  $nuxt.$app.updating = false
}

//+-------------------------------------------------
// sync()
// Receives the configuration to be used by the importer
// And starts the process -> detect and connect
// -----
// Options available:
// - log: function
// - platform: 'steam'
// - background: boolean
// -----
// Created on Mon Jan 22 2024
//+-------------------------------------------------
async function sync(options = {}) {
  _sync.enabled = true
  _sync.background = options.background ?? false

  _sync.x.log = options.log ?? log
  _sync.x.source = options.platform ?? null

  log('💠 Importer(1): sync')

  let _detect = await detect()
  if (_detect == false) return false
  if (_sync.x.account?.error == 'account:login') return _sync.x

  // await delay(2000, true)
  if ((await connect()) == false) return false

  // Wait for the user to start the scan
  return _sync.x
}

//+-------------------------------------------------
// detect()
// -----
// Created on Tue Jan 23 2024
//+-------------------------------------------------
async function detect() {
  const detected = importer.detect(_sync.x)

  if (detected) {
    _sync.x.module = { ...detected.module }
    _sync.x.account = { ...detected.account }

    return true
  }

  return false
}

//+-------------------------------------------------
// connect()
// -----
// Created on Tue Jan 23 2024
//+-------------------------------------------------
async function connect() {
  const connected = importer.connect(_sync.x)

  return connected
}

//+-------------------------------------------------
// scan()
// Scan the library and import data from source
// -----
// Created on Tue Jan 23 2024
//+-------------------------------------------------
async function scan() {
  const scanned = await importer.scan(_sync.x)

  if (_sync.x.status) return _sync.x
  if (scanned) _sync.x.data = { ...scanned }

  await prepare()
  return _sync.x
}

//+-------------------------------------------------
// prepare()
// - Generates appsToImport, appsToUpdate from data
// -----
// Created on Tue Jan 23 2024
//+-------------------------------------------------
async function prepare() {
  const prepared = await importer.prepare(_sync.x)

  if (prepared) {
    _sync.x.apps = {
      toReview: prepared.toReview,
      toImport: prepared.toImport,
      toUpdate: prepared.toUpdate,
    }
  }

  return true
}

//+-------------------------------------------------
// store()
// - Saves to DDBB
// - Tries to update missing apps
// -----
// Created on Wed Jan 24 2024
// Updated on Thu Apr 11 2024
//+-------------------------------------------------
async function store(options = {}) {
  if (options.apps) {
    _sync.x.apps = {
      toUpdate: options.apps.toUpdate || [],
      toImport: options.apps.toImport || [],
      toIgnore: options.apps.toIgnore || [],
    }
  }

  const stored = await importer.store(_sync.x)

  if (stored) {
    _sync.x.apps.stored = [...stored.uuids]
    notify()
    return true
  }

  return false
}

//+-------------------------------------------------
// notify()
// Adds to journal, and ends the process
// -----
// Created on Wed Jan 24 2024
//+-------------------------------------------------
function notify() {
  importer.wrap(_sync.x)

  $nuxt.$toast.dismiss($toast)
  $nuxt.$toast.info('Your ' + _sync.x.source + ' library has been updated', {
    description: 'Updated ' + _sync.x.apps.stored.length + ' games in your library',
  })
}

//+-------------------------------------------------
// init()
// Mount nuxt instance and start an autosync
// -----
// Created on Mon Jan 22 2024
//+-------------------------------------------------
function init() {
  window.setTimeout(() => {
    autoSync()
  }, 2000)
}

//+-------------------------------------------------
// Define Nuxt plugin
// $_sync and window.$_sync
// -----
// Created on Mon Jan 22 2024
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  if (!$nuxt) $nuxt = nuxtApp

  window.$_sync = _sync
  init()

  _sync.sync = sync
  _sync.scan = scan
  _sync.store = store

  return {
    provide: {
      importer: _sync,
    },
  }
})
