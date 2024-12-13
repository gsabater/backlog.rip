/*
 * @file:    \utils\importer.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 22nd January 2024
 * Modified: Fri 13 December 2024 - 13:28:30
 */

import axios from 'axios'
// import steam from '~/modules/importers/steam'

let $nuxt = null
let $data = null
let $game = null
let $state = null
let $axios = null
let $library = null
let $journal = null

//+-------------------------------------------------
// Import flow:
//
// 1. detect()
// - Detects the platform and check if is valid
//
// 2. connect()
// - Gives axios instance, user data and logs to the module
//
// 3. scan()
// - Performs queries to fetch data
// -----
// Created on Thu Nov 28 2024
//+-------------------------------------------------

export default {
  //+-------------------------------------------------
  // detect()
  // - Detects platform and check if is valid
  // - Detect if the user is logged in
  // - Detects that the requested library module is present
  // +- available, and has the required methods
  // -----
  // Created on Mon Jan 22 2024
  // Updated on Wed Nov 27 2024 - Simplified using $library
  //+-------------------------------------------------
  detect(x = {}) {
    log('💠 Importer(2): detect')
    $nuxt ??= useNuxtApp()
    $data ??= useDataStore()
    $game ??= useGameStore()
    $state ??= useStateStore()
    $library ??= useLibraryStore()

    x.log(`💠🎨 source ID: ${x.source}`)
    let account = {}

    try {
      // Detect: Check if the source is valid
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      x.log('Detect 2.1: valid source')
      if (!$library.integrations.includes(x.source)) {
        x.log(`💠 Source ${x.source} not supported`)
        return false
      }

      // Detect: The platform module is available
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      x.log('Detect 2.2: valid module')
      if ($library.module[x.source] == undefined) {
        x.log('💠 The ' + x.source + ' module integration is not available', 'error')
        return false
      }

      // Detect: If the module is complete
      // And has all required methods to run
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      x.log('Detect 2.3: The module is complete')
      if (
        $library.module[x.source].update === undefined ||
        $library.module[x.source].getLibrary === undefined ||
        $library.module[x.source].hasUpdates === undefined ||
        $library.module[x.source].getUserdata === undefined
      ) {
        x.log('The module module complete, some methods are not present', 'error')
        return false
      }

      // Detect: Detect if the user is logged in
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      x.log('Detect 2.4: valid integration')
      if (
        $library.linked[x.source]?.account
        // $nuxt.$auth.bearer &&
        // $nuxt.$auth.user[x.source] &&
        // $nuxt.$auth.user[x.source + '_data']
      ) {
        account = {
          bearer: $nuxt.$auth.bearer,
          ...$library.linked[x.source],
          // structuredClone($library.linked[x.source]),
        }
      } else {
        account = { error: 'account:login' }

        x.log(
          'User needs to login with provider - code: [account:login]',
          'error',
          'account:login'
        )
      }

      x.log('✅ Detected')
    } catch (e) {
      console.error('💠🔴 detect() found an error', e)
      return false
    }

    return {
      // module: steam,
      account: account,
    }
  },

  //+-------------------------------------------------
  // connect()
  // - creates a new axios instance
  // - connects to the module giving data
  // -----
  // Created on Mon Jan 22 2024
  // Updated on Tue Mar 26 2024
  //+-------------------------------------------------
  connect(x = {}) {
    log('💠 Importer(3): connect')

    try {
      // Connect: Create a new axios instance
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      x.log('Connect 3.1: Create a new axios instance')
      $axios = axios.create({
        timeout: 60000,
      })

      // Connect: Generate a states object
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      x.states = $state.states
      // {
      //   states: $state.states,
      //   backlog: $state.backlog,
      //   playing: $state.playing,
      //   completed: $state.completed,
      // }

      // Connect: Give methods and data to the module
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      x.log('Connect 3.2: Connect with the module')
      x.module.connect(x.account, $axios, x.log, {
        states: x.states,
      })

      x.log('✅ Connected and ready to start')
    } catch (e) {
      console.error(e)
      return false
    }

    return true
  },

  //+-------------------------------------------------
  // scan()
  // Calls the module methods to retrieve user data
  // -----
  // Created on Tue Jan 23 2024
  // Updated on Tue Apr 16 2024 - Added error handling
  // Updated on Thu Nov 28 2024 - Simplified
  //+-------------------------------------------------
  async scan(x = {}) {
    x.log('💠 Importer(4): Starting data scan...')

    let data = {
      user: {},
      games: [],
      // library: [],

      // TODO: things that will be imported
      // lists: [],
      // states: [],
      // data.backlog will be defined as well from steam.onScan
      // steambacklog: {}, // quick dirty hack
    }

    try {
      // x.log('Check 4.1: Get local library')
      // data.library = $data.steam_library()
      // x.log(`🆗 Library loaded`, data.library.length)
      x.log('Check 4.1: Get userdata')
      data.user = await x.module.getUserdata()
      x.log(`🆗 Account userdata loaded`)

      x.log('Check 4.3: Get library')
      data.games = await x.module.getLibrary()
      x.log(`🆗 Games loaded`)

      // if (x.module.onScan !== undefined) {
      //   x.log('Check 4.4: onScan hook')
      //   data.steambacklog = await x.module.onScan(data, x)
      //   x.log(`🆗 onScan hook executed`)
      // }

      // this.data.wishlist = await x.module.getWishlist()
      // x.log(`🎁 Wishlist received`)
    } catch (e) {
      x.log('Error getting user data', 'error', e)
      console.error('💠🔴 scan() found an error', e)
      return false
    }

    x.log('Check 4.5: scan post validation')
    if (data.games.length === 0) {
      x.code = 'library:empty'
      x.status = 'error'
      return false
    }

    return data
  },

  //+-------------------------------------------------
  // prepare()
  // - library, changes and missing
  // -----
  // Created on Tue Jan 23 2024
  // Updated on Fri Dec 13 2024 - Request missing games
  //+-------------------------------------------------
  async prepare(x = {}) {
    x.log('💠 Importer(5): Preparing data ...')

    let map = x.module.manifest.map

    let library = {}
    let changes = []
    let missing = []

    x.log('Check 5.1: Preparing Array of library IDs')
    let data = $data.library()
    let filtered = data.filter((item) => item.id[map[1]])

    library = filtered.reduce((item, el) => {
      item[el.id[map[1]]] = el
      return item
    }, {})

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Review all apps fetched by the connector
    // And determine if they will be added, updated, etc
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    x.data.games.forEach((app) => {
      let appid = app[map[0]]

      let db = library[appid]
      if (!db) missing.push(appid)

      let element = {
        db: db,
        data: app,

        sourceID: appid,
        uuid: db?.uuid || null,
      }

      let sync = x.module.hasUpdates(app, db)
      element.sync = sync
      if (sync === false) return

      // sync.forEach((key) => {
      // synced[key] = x.module.hasUpdates(key, db, app)
      // element[key] = synced[key]

      // if (['name'].includes(key)) delete synced[key]
      // let newPlaytime = x.module.hasUpdates('playtime', db, app)
      // })

      // Fill name value
      if (!element.name) element.name = db?.name || app.name
      if (!element.name) element.name = ''

      // if (element.uuid && Object.values(synced).every((value) => value == false)) {
      //   return
      // }

      // element.synced = synced
      changes.push(element)

      // Update: playtime
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // let newPlaytime = steam.hasUpdates('playtime', lib, app)
      // if (newPlaytime !== false) {
      //   add = true
      //   app.toUpdate.playtime = newPlaytime
      // }

      // Update: last_played
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // let lastPlayed = steam.hasUpdates('last_played', lib, app)
      // if (lastPlayed !== false) {
      //   add = true
      //   app.toUpdate.last_played = lastPlayed
      // }

      // if (add) apps.toUpdate.push(app)
      // } else {
      //   app.will_import = true
      //   app.will_ignore = false

      //   apps.toReview.push(app)
      // }
    })

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Preload missing games from the API
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    x.log('🪂 Requesting missing data')
    $data.updateMissing(missing)

    // x.log('Check 5.2: Preparing an Array ready to import')
    // apps.toImport = apps.toReview.map((item) => {
    //   return {
    //     data: item,
    //     ['steam' + '_id']: item.appid,
    //   }
    // })

    return { library, changes }
  },

  //+-------------------------------------------------
  // store()
  //
  // -----
  // Created on Wed Jan 24 2024
  //+-------------------------------------------------
  async store(x = {}) {
    x.log('💠 Importer(6): Storing data ...')
    if (!$data) $data = useDataStore()

    let uuids = []
    const items = []
    let map = x.module.manifest.map

    x.log('Check 6.1: Processing the array of changes')
    x.changes.forEach((item) => {
      if (!item.enabled) return

      let app = $data.findBySource(map[1], item.data[map[0]])
      if (!app) app = $game.create({})

      app = x.module.update(app, item.data)
      items.push(app)
    })

    x.log('Check 6.2: Storing apps')
    await $data.process(items, 'import')
    await $state.indexLibrary('all')

    x.log('✅ Data stored')

    return {
      uuids: x.changes.map((x) => x.uuid),
    }
  },

  //+-------------------------------------------------
  // wrap()
  //
  // -----
  // Created on Wed Jan 24 2024
  //+-------------------------------------------------
  wrap(x = {}) {
    x.log('💠 Importer(7): Wrapping up ...')
    if (!$nuxt) $nuxt = useNuxtApp()
    if (!$data) $data = useDataStore()
    if (!$journal) $journal = useJournalStore()

    x.log('7.1: Writing journal')
    let keys = x.apps.stored || []
    $journal.add({
      event: 'added',
      data: {
        store: x.source,
        games: keys,
      },
    })

    x.log('7.2: Updating user data')
    $nuxt.$auth.me.steam_updated_at = dates.now()
    $nuxt.$auth.updateAccount('steam_updated_at')
  },
}
