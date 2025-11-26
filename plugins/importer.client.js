/*
 * @file:    \plugins\importerService.client.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 22nd January 2024
 * Modified: 7th November 2025 - 10:53:37
 */

import importerService from '../services/importerService'

//+-------------------------------------------------
// Importer plugin (_sync)
// Performs actions to scan, prepare and store a library
// Allows automatic and silent import of libraries
//+-------------------------------------------------

let $nuxt = null
let $toast = null
let $integration = null

const _sync = {
  x: {
    log: null, // logger used to communicate with the layout
    source: null, // source currently running ('steam', 'gog'...)

    // From detect...
    // run: null, // The module runner from $integration used for the integration
    // module: null, // the module assigned to that source to run the import
    states: {}, // User states from $db store
    account: null, // The user account with userdata at the selected source

    // Scan and prepare...
    data: {},
    library: {},
    changes: [],
    // apps: {},

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

  if ($nuxt.$app.count.library == 0) {
    log('♾️ AutoSync cancelled - No games in library')
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

    $nuxt.$auth.me.steam_updated_at = dates.now()
    $nuxt.$auth.updateMe('steam_updated_at')

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
  $integration ??= useLibraryStore()

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
  const detected = importerService.detect(_sync.x)

  if (detected) {
    _sync.x.module = { ...detected.module, wip: 'deleteme' }
    _sync.x.module = $integration.module[_sync.x.source]
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
  const connected = importerService.connect(_sync.x)

  return connected
}

//+-------------------------------------------------
// scan()
// Scan the library and import data from source
// -----
// Created on Tue Jan 23 2024
//+-------------------------------------------------
async function scan() {
  const scanned = await importerService.scan(_sync.x)

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
// Updated on Thu Nov 28 2024 - Simplified with a single changes array
//+-------------------------------------------------
async function prepare() {
  const prepared = await importerService.prepare(_sync.x)

  if (prepared) {
    _sync.x.library = prepared.library
    _sync.x.changes = prepared.changes
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
      enabled: options.apps.enabled ?? true,
      toUpdate: options.apps.toUpdate || [],
      toImport: options.apps.toImport || [],
      toIgnore: options.apps.toIgnore || [],
    }
  }

  const stored = await importerService.store(_sync.x)

  if (stored) {
    _sync.x.apps.stored = stored
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
// Updated on Sun Mar 02 2025 - Emit a notification
//+-------------------------------------------------
function notify() {
  importerService.wrap(_sync.x)

  $nuxt.$toast.dismiss($toast)
  $nuxt.$toast.info('Your ' + _sync.x.source + ' library has been updated', {
    description: 'Applied ' + _sync.x.apps.enabled.length + ' changes to your library',
  })

  $nuxt.$mitt.emit('library:added')
}

//+-------------------------------------------------
// init()
// Mount nuxt instance and start an autosync
// -----
// Created on Mon Jan 22 2024
//+-------------------------------------------------
// function init() {
//   window.setTimeout(() => {
//     autoSync()
//   }, 4000)
// }

//+-------------------------------------------------
// Define Nuxt plugin
// $_sync and window.$_sync
// -----
// Created on Mon Jan 22 2024
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  let time = performance.now()
  let { $app, $mitt } = nuxtApp

  $nuxt = nuxtApp
  $toast = nuxtApp.$toast

  _sync.sync = sync
  _sync.scan = scan
  _sync.store = store

  // Register and provide the app object to Nuxt
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $app.register('importer', time)
  nuxtApp.provide('importer', _sync)
})
