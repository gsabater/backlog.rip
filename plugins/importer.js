/*
 * @file:    \plugins\_sync.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 22nd January 2024
 * Modified: Sat Jan 27 2024
 */

import importer from '~/utils/importer'
import Toast from '../components/toasts/Importing.vue'

//+-------------------------------------------------
// Importer plugin (_sync)
// Performs an automatic and silent import of libraries
// Fires events to communicate with the layout
// -----
// Created on Mon Jan 22 2024
//+-------------------------------------------------

let $nuxt = null
let $toast = null

const _sync = {
  x: {
    log: null, // logger used to communicate with the layout
    source: null, // source currently running

    // From detect...
    module: null, // the module assigned to that source to run the import
    account: null, // The user account with userdata at the selected source

    // From connect...
    manifest: null,

    // Scan and prepare...
    data: {},
    apps: {},
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
function autoSync() {
  let autosync_steam = $nuxt?.$auth?.config?.autosync_steam ?? false
  if (autosync_steam) {
    sync({
      platform: 'steam',
      background: true,
    })
  } else log('♾️ AutoSync cancelled - not enabled in settings', autosync_steam)
}

//+-------------------------------------------------
// sync()
// Receives the configuration to be used by the importer
// And starts the chain process
// Detect, connect and sync the library
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

  if (_sync.background) {
    $toast = $nuxt.$toast(Toast, {
      duration: Infinity,
    })

    await delay(5000, true)
    notify()
    return
  }

  log('💠 Importer(1): sync')

  // await delay(2000, true)
  if ((await detect()) == false) return false

  // await delay(2000, true)
  if ((await connect()) == false) return false

  // Waiting to the user to start the scan
  if (!_sync.background) {
    return _sync.x
  }

  // ... scan , prepare and store

  console.error('wip')
  return
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
    // console.warn(_sync.x)

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

  if (connected) {
    _sync.x.manifest = { ...connected.manifest }
    console.warn(_sync.x)

    return true
  }

  return false
}

//+-------------------------------------------------
// scan()
// Scan the library and import data from source
// -----
// Created on Tue Jan 23 2024
//+-------------------------------------------------
async function scan() {
  const scanned = await importer.scan(_sync.x)
  if (scanned) _sync.x.data = { ...scanned }

  await prepare()

  if (!_sync.background) {
    return _sync.x
  }
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
      toImport: prepared.toReview,
      toUpdate: prepared.toUpdate,
    }
  }

  return true

  store()
}

//+-------------------------------------------------
// store()
// - Saves to DDBB
// -----
// Created on Wed Jan 24 2024
//+-------------------------------------------------
function store() {
  console.info('6. sync store')
  const stored = importer.store({
    log,
    inst: _sync.x,
  })

  if (stored) {
    notify()
  }
}

//+-------------------------------------------------
// notify()
// Adds to journal, and ends the process
// -----
// Created on Wed Jan 24 2024
//+-------------------------------------------------
function notify() {
  $nuxt.$toast.dismiss($toast)
  $nuxt.$toast.info('Your Steam library has been updated', {
    description: 'Monday, January 3rd at 6:00pm',
  })
}

//+-------------------------------------------------
// init()
// Mount nuxt instance and start an autosync
// -----
// Created on Mon Jan 22 2024
//+-------------------------------------------------
function init(nuxt) {
  if (!$nuxt) $nuxt = nuxt

  window.setTimeout(() => {
    autoSync()
  }, 1000)
}

//+-------------------------------------------------
// Define Nuxt plugin
// $_sync and window.$_sync
// -----
// Created on Mon Jan 22 2024
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  window.$_sync = _sync
  init(nuxtApp)

  _sync.sync = sync
  _sync.scan = scan

  return {
    provide: {
      importer: _sync,
    },
  }
})
