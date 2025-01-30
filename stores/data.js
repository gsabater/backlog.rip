/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Thu 30 January 2025 - 16:48:06
 */

let $nuxt = null
let $game = null
let $cloud = null

//+-------------------------------------------------
// Data sources
// ---
// Data is the complete list of games loaded by the app
// Updated every time a repository is loaded or a game is added
//+-------------------------------------------------

let data = {}

// Buffer is a top-list of games fetch from the api
// let buffer = {}

//+-------------------------------------------------
// Repos
// Repositories are searches and preset filters
// They are stored in the database and can be updated
//+-------------------------------------------------

let repos = {}
let search = {}

//+-------------------------------------------------
// index (ed, api, epic, igdb, steam)
// Hold index values for each app in every store
// ---
// Indexed has uuids, if an api uuid is indexed, just skip it
// Stores index have the store ID as key and the data[uuid] as value
//+-------------------------------------------------

let index = {
  ed: [],
  lib: [],
  api: {},
  igdb: {},
  epic: {},
  steam: {},

  fav: [],
  pinned: [],
  hidden: [],
}

export const useDataStore = defineStore('data', {
  state: () => ({
    loaded: [],
    indexes: [],
  }),

  getters: {
    index() {
      return index
    },

    libLatest() {
      // let games = await $nuxt.$db.games
      //   .orderBy('created_at')
      //   .reverse()
      //   .limit(10)
      //   .toArray()
      return index.lib.sort((a, b) => b.created_at - a.created_at).slice(0, 30)
    },
  },

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Methods to load data
  // * loadGames()
  // * loadApiStatus()
  //
  // Methods to retrieve data
  // * list() <-- Returns the whole data object
  // * library() <-- data where is.lib == true
  // * pinned() <-- data where is.pinned == true
  // * hidden() <-- data where is.hidden == true
  // * get() <-- element by uuid
  // * getRandom() <-- Get random elements
  //
  // Methods to Query the API
  // * search() <- apiservice
  //
  // Methods to persist data
  // * store() <-- Stores an array of items and updates indexes
  // * delete() <-- Deletes an item from the database
  //
  // Utilities to manage data
  // * process() <- entry point for new data
  // * prepareToStore()
  // * toData()
  // * toIndex()
  // * setIndex()
  // * isIndexed()
  // * inInLibrary()
  // * countLibrary()
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  actions: {
    status() {
      console.warn('Data satus')
      console.log('Data', data)

      console.table({
        'Loaded': this.loaded.join(', '),
        'Indexes': this.indexes.join(', '),
        '-- Data --': '----',
        // 'Api': JSON.stringify(this.api),
        'Data': Object.keys(data).length,
        'Library': index.lib.length,
        // 'Wishlist': Object.keys(wishlist).length,
        '-- Repos --': '----',
        'Repos': Object.keys(repos).join(', '),
        'Search': Object.keys(search).join(', '),
        '-- Index --': '----',
        'Indexed': index.ed.length,
        // Temporary disabled
        // 'API': Object.keys(index.api).length,
        // 'GOG': Object.keys(index.gog).length,
        // 'IGDB': Object.keys(index.igdb).length,
        // 'Epic': Object.keys(index.epic).length,
        'Steam': Object.keys(index.steam).length,
      })

      console.warn(index['steam'][440], data[index['steam'][440]])
    },

    //+-------------------------------------------------
    // list()
    // Returns the whole data object
    // -----
    // Created on Tue Nov 21 2023
    // Updated on Wed Jul 24 2024 - Return as array
    //+-------------------------------------------------
    list(as = 'object') {
      if (as == 'array') return Object.values(data).filter(Boolean)

      return data
    },

    //+-------------------------------------------------
    // library()
    // Returns the library as an array or object
    // -----
    // Created on Mon Dec 25 2023
    // Updated on Wed Feb 14 2024 - Library is now an index
    // Created on Wed Jul 24 2024 - Work with other indexes
    //+-------------------------------------------------
    library(as = 'array', key = 'lib') {
      let library = [...index[key]]

      if (as == 'object') {
        return Object.fromEntries(
          library.filter((uuid) => Boolean(data[uuid])).map((uuid) => [uuid, data[uuid]])
        )
      }

      return library.map((uuid) => data[uuid]).filter(Boolean)
    },

    //+-------------------------------------------------
    // pinned and hidden()
    // Returns a list of apps marked as pinned
    // -----
    // Created on Wed Jul 24 2024
    //+-------------------------------------------------
    pinned(as = null) {
      return this.library(as, 'pinned')
    },

    hidden(as = null) {
      return this.library(as, 'hidden')
    },

    //+-------------------------------------------------
    // countLibrary()
    // Counts the library filtering out hidden and non library items
    // -----
    // Created on Tue Jul 23 2024
    // Updated on Thu Jan 30 2025 - Update count values
    //+-------------------------------------------------
    countLibrary() {
      let library = this.library()
      let active = library.filter((item) => {
        if (!item.is?.lib || item.is?.hidden) {
          return false
        }

        return true
      })

      $nuxt.$app.count.data = Object.keys(data).length || 0
      $nuxt.$app.count.library = active.length
    },

    //+-------------------------------------------------
    // get()
    // Get an element by uuid Maybe move to a getter
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    get(uuid) {
      if (!uuid) return
      if (data[uuid]) return data[uuid]
      if (index.api[uuid] && data[index.api[uuid]]) return data[index.api[uuid]]

      return {
        uuid: uuid,
        error: 'missing',
        character: 'pikachu',
        face: 'surprised',
      }
    },

    findBySource(source, id) {
      let uuid = index[source][id]
      return data[uuid]
    },

    //+-------------------------------------------------
    // getRandom()
    // Get random elements from the data object
    // -----
    // Created on Thu Apr 18 2024
    //+-------------------------------------------------
    getRandom(amount = 1) {
      console.warn(Object.values(data).length)
      let items = Object.values(data)
        .sort(() => Math.random() - 0.5)
        .slice(0, amount)

      return items
    },

    getRecentlyAdded(amount = 30, as = 'uuid') {
      let items = Object.values(data)
        .sort((a, b) => {
          const libA = a.is?.lib ?? 0
          const libB = b.is?.lib ?? 0
          return libB - libA // Sort in ascending order
        })
        .slice(0, amount)

      if (as == 'array') return items

      return items.map((item) => item.uuid)
    },

    //+-------------------------------------------------
    // process()
    // Main entry point for an app to become data
    // The intent is a flag used to hint what the data
    // has been loaded for
    // -----
    // TODO: if intent is library, and we find an already indexed app
    // if the app or the indexed has local: compare all id entries and delete local
    // -----
    // Created on Fri Feb 16 2024
    // Created on Wed Jan 15 2025 - Refactoring
    //+-------------------------------------------------
    async process(apps, intent) {
      if (!apps.length) apps = [apps]

      console.warn(
        ' 🪄 process',
        intent,
        apps.length,
        apps[Math.floor(Math.random() * apps.length)]
      )

      apps.forEach((item) => {
        if (item === true || (Array.isArray(item) && item.length === 0)) {
          console.error('🔥', item, intent)
          return
        }

        // Debugger
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (
          $nuxt.$app.wip &&
          // if (item.name == 'DOOM') {
          // if (intent == 'add:new') {
          (item.uuid == '5c1c9b5a-1c02-4a56-85df-f0cf97929a48' ||
            item.uuid == '94327609-250d-4f98-93b3-cd380eb19a9b' ||
            item.uuid == '4434fa13-4f18-44ec-ad80-db412ba28a96')
        ) {
          // console.warn('✨ ' + item.name, item, intent)
          // debugger
        }

        // Find the index in data
        let indexed = this.isIndexed(item)

        // Games coming from indexedDB are library
        // and will be added to data
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (intent == 'library') {
          // console.warn('1 ⇢ app to lib', item.uuid, item.name)
          this.toData(item)
          return
        }

        if (!intent.includes) {
          console.warn(item, intent)
          debugger
        }

        // Update existing games
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (indexed && intent?.includes('update:')) {
          // console.warn('2 ⇢ updating app (update:)', item.uuid, item.name)
          $game.update(indexed.uuid, item)
          // if (item.is?.lib) item.is.dirty = true
          // this.toData(item)
          return
        }

        // If the game is already indexed and just
        // comes from the api, check if has updates
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (indexed && intent == 'api') {
          // console.warn('3 ⇢ updating app from API', item.uuid, item.name)
          // if (indexed.uuid == item.uuid) {

          if (index.lib.includes(indexed.uuid)) {
            // console.warn('3.1 ⇢ updating app in lib', data[indexed.uuid])
            $game.update(indexed.uuid, item)
            return
          } else if (index.ed.includes(indexed.uuid)) {
            // console.warn('3.3 ⇢ app already indexed')
            return
          } else {
            // console.warn('3.2 ⇢ indexed app with another uuid...')
            this.toData(item)
            return
          }
        }

        // An imported game comes from the plugins
        // usually already normalized
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (intent == 'import') {
          // console.warn('6 ⇢ Imported app', item.uuid, item.name)
          this.toData(item)
          return
        }

        // Just add api games to data to be used in searches
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (!indexed && intent == 'api') {
          // console.warn('4 ⇢ app to data from API', item.uuid, item.name)
          this.toData(item)
          return
        }

        // Store an app
        // Usually after it has already been updated
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (intent?.includes('store:') || intent?.includes('updated:')) {
          // console.warn('5 ⇢ app to store (store:)', item.uuid, item.name)
          item.toStore = true
          this.toData(item)
          return
        }

        // End of the new code
        // Code below is considered legacy...
        debugger

        // Flag games coming from API as is_api
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // if (intent == 'api') {
        //   item.is_api = true
        //   item.api_id = item.api_id || item.uuid
        //   // item.id.api = item.id.api || item.uuid
        //   // if (!item.uuid) item.uuid = `local:${format.stringToSlug(item.name)}`
        // }

        // Populate the data from a list
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (intent?.includes('list:')) {
          item.is_api = true
          item.api_id = item.uuid
        }

        // Adding games manually
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (intent?.includes('add:')) {
          item.is.dirty = true
          this.toData(item)
          return
        }

        // let appUUID = this.isIndexed(item)
        // if (appUUID === true) return

        // if (!appUUID) this.toData(item)
        // else $game.update(appUUID, { ...item, trigger: true })
      })

      // wip: Update some state data with some throttling
      // this.updateState()

      this.countLibrary() // index.lib.length || 0

      if (!$nuxt.$app.ready) return
      if (intent.includes('list:')) return
      if (intent.includes('update:')) return

      $nuxt.$mitt.emit('data:updated')
    },

    //+-------------------------------------------------
    // prepareToStore()
    // to ensure consistency, add base values to the item
    // and remove unwanted values before returning back
    // -----
    // Created on Thu Dec 14 2023
    // Updated on Tue Feb 27 2024
    // updated on Thu Jul 11 2024 - Clone the object
    //+-------------------------------------------------
    prepareToStore(item) {
      if (!item) {
        console.error('🔥 Called prepareToStore without item')
        return
      }

      let app = JSON.parse(JSON.stringify(item))
      app.uuid = app.uuid || `local:${$nuxt.$uuid()}`

      app.is.lib = app.is.lib === 0 ? 0 : app.is.lib || dates.stamp()

      // app.is = app.is || {}

      // app.log = app.log || []

      // // Default created at timestamp, should come from api
      // // But sometimes it doesn't or the game is created locally
      // app.created_at = app.created_at || dates.now()

      // Delete internal flags
      // Those are used for application logic
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      delete app.will_import
      delete app.will_update
      delete app.will_ignore

      delete app.is_api
      delete app.is.dirty

      delete app._
      delete app.data
      delete app.source

      return app
    },

    //+-------------------------------------------------
    // store()
    // Stores an array of items in games table
    // Updates indexes, library and data arrays
    // -----
    // Created on Fri Dec 22 2023
    //+-------------------------------------------------
    store(items) {
      if (!items.length) items = [items]

      let prepared = []
      items = items.forEach((item) => {
        let prep = null

        // if (typeof item == 'string') {
        //   prep = this.prepareToStore(data[item])
        // }

        // if (typeof item == 'object') {
        //   prep = this.prepareToStore(item)
        // }

        // prettier-ignore
        prep = this.prepareToStore(
          typeof item == 'string'
          ? {...data[item]}
          : item)

        prepared.push(prep)
      })

      if (prepared.length == 1) $nuxt.$db.games.put(prepared[0])
      else $nuxt.$db.games.bulkPut(prepared)

      log(
        `🎴 Stored ${prepared.length} items`,
        prepared[Math.floor(Math.random() * prepared.length)]
      )
    },

    //+-------------------------------------------------
    // delete()
    // deletes an item from the database
    // -----
    // Created on Wed Feb 14 2024
    //+-------------------------------------------------
    async delete(uuid) {
      if (!uuid) return
      let item = data[uuid]
      console.warn('🔥 Deleting', uuid)

      delete data[uuid]
      $nuxt.$db.games.delete(uuid)

      // Delete indexes
      delete index.ed[index.ed.indexOf(uuid)]
      delete index.lib[index.lib.indexOf(uuid)]
      delete index.igdb[item.id.igdb]
      delete index.steam[item.id.steam]

      // update counters
      $nuxt.$app.count.data = Object.keys(data).length || 0
      $nuxt.$app.count.library = index.lib.length || 0

      // Emits event
      $nuxt.$mitt.emit('data:deleted', { uuid })
    },

    //+-------------------------------------------------
    // toIndex()
    // Adds item IDs to various indexes.
    // Those indexes are then used to find the game by the ref
    // -----
    // Created on Thu Nov 30 2023
    // Updated on Thu Apr 25 2024 - Added id.api ref
    //+-------------------------------------------------
    toIndex(app) {
      if (app.id.api) index.api[app.id.api] = app.uuid
      if (app.id.igdb) index.igdb[app.id.igdb] = app.uuid
      if (app.id.steam) index.steam[app.id.steam] = app.uuid

      if ((this.isLibrary(app) || app.is.dirty) && !index.lib.includes(app.uuid)) {
        index.lib.push(app.uuid)
      }

      index.ed.push(app.uuid)
    },

    //+-------------------------------------------------
    // setIndex()
    // Replaces an index with a new array
    // -----
    // Created on Wed Jul 24 2024
    //+-------------------------------------------------
    setIndex(key, app) {
      index[key] = app

      if (key == 'fav' || key == 'hidden' || key == 'pinned') {
        $nuxt.$app.count[key] = index[key].length
      }
    },

    //+-------------------------------------------------
    // reIndex()
    // Changes the index of an app and reindexes again
    // -----
    // Created on Thu Dec 12 2024
    //+-------------------------------------------------
    reIndex(local, uuid) {
      let app = data[local]
      // console.warn('reindex', local, uuid, app)
      if (!app) return local

      app.uuid = uuid
      this.toIndex(app)

      delete index.lib[index.lib.indexOf(local)]
      // delete queue.add[queue.add.indexOf(local)]
      queueService.queue(uuid)
      queueService.unqueue(local)

      // this.addToQueue(uuid)
      // this.addToQueue(local, 'delete')

      // $nuxt.$db.games.delete(local)
      // $nuxt.$db.games.put(app)

      return uuid
    },

    //+-------------------------------------------------
    // isLibrary()
    // Returns true when an item belongs to, or should
    // belong to the library. The library is the list of apps
    // that are stored in the local database, owned or not
    // -----
    // Created on Sun Feb 25 2024
    // Updated on Wed Jan 15 2025 - Changed local: uuid
    //+-------------------------------------------------
    isLibrary(item) {
      if (item.state) return true
      if (item.is?.lib) return true
      if (item.uuid.includes('local:')) return true

      return false
    },

    //+-------------------------------------------------
    // isIndexed()
    // Tries to find an item in data
    // Returns uuid of data when found
    // -----
    // Created on Thu Jan 11 2024
    // Updated on Thu Jan 16 2025 - Return index information
    //+-------------------------------------------------
    isIndexed(item) {
      for (const store of this.indexes) {
        if (
          (item.id?.store && index[store][item.id[store]]) ||
          (item[store + '_id'] && index[store][item[store + '_id']])
        ) {
          return {
            index: store,
            uuid: index[store][item[store + '_id']] || index[store][item.id[store]],
          }
        }
      }

      if (index.ed.includes(item.uuid))
        return {
          index: 'ed',
          uuid: item.uuid,
        }

      return false
    },

    //+-------------------------------------------------
    // isInLibrary()
    // Tries to determine if an item is in the libraryeteryrhgjfgjj
    // -----
    // Created on Fri Jul 05 2024
    //+-------------------------------------------------
    isInLibrary(item, deep = false) {
      if (!deep) return index.lib.includes(item.uuid)
      else {
        let isIndexed = this.isIndexed(item)

        return isIndexed && index.lib.includes(isIndexed.uuid)
      }
    },

    //+-------------------------------------------------
    // toData()
    // Adds apps to window.data and updates indexes
    // -----
    // Created on Tue Nov 21 2023
    // updated on Fri Feb 16 2024
    // Created on Sun Feb 25 2024 - Adds to queue
    //+-------------------------------------------------
    async toData(item) {
      // Prepare the game to be ingested
      let game = dataService.prepareToData({ ...item })

      // Add the items to be stored to the queue
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (game.is?.dirty || game.toStore) {
        delete game.toStore
        delete game.is.dirty

        queueService.queue(game.uuid)
      }

      // Add it to data and index
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      data[game.uuid] = game
      this.toIndex(game)
    },

    //+-------------------------------------------------
    // loadGames()
    // Loads the entire library from indexedDB into memory
    // -----
    // Created on Fri Nov 17 2023
    // Updated on Sun Feb 25 2024
    //+-------------------------------------------------
    async loadGames(reload = false) {
      if (this.loaded.includes('library') && !reload) return

      let games = await $nuxt.$db.games.toArray()
      await this.process(games, 'library')
      this.loaded.push('library')

      log(
        '🎴 local:games',
        `${games.length} apps in local DB`,
        games[Math.floor(Math.random() * games.length)]
      )
    },

    //+-------------------------------------------------
    // emptyLibrary()
    // Empties the library, clearing Dexie DB and related indexes
    // -----
    // Created on Fri Sep 13 2024
    //+-------------------------------------------------
    async emptyLibrary() {
      let library = this.library()

      library.forEach((item) => {
        delete data[item.uuid]

        // Delete indexes
        delete index.ed[index.ed.indexOf(item.uuid)]
        delete index.igdb[item.id.igdb]
        delete index.steam[item.id.steam]
      })

      // Clear Dexie DB
      await $nuxt.$db.games.clear()

      // Clear related indexes
      index.lib = []
      index.fav = []
      index.pinned = []
      index.hidden = []

      // Update counters
      $nuxt.$app.count.data = Object.keys(data).length || 0
      $nuxt.$app.count.library = 0

      // Emit event
      $nuxt.$mitt.emit('library:emptied')
      console.warn('🗑️ Library emptied')

      this.loaded = this.loaded.filter((item) => item !== 'library')
    },

    //+-------------------------------------------------
    // loadApiStatus()
    // Just load some status from API
    // NOTE: Might be moved to apiStore
    // -----
    // Created on Fri Dec 22 2023
    //+-------------------------------------------------
    async loadApiStatus() {
      if (this.loaded.includes('api')) return

      try {
        const xhr = await $nuxt.$axios.get(`get/status.json`)
        if (xhr.status) {
          $nuxt.$app.api = xhr.data
          $nuxt.$app.count.api = xhr.data?.games?.total || 0
        }
      } catch (error) {
        log('Could not establish connection with the API, working on offline mode')
        $nuxt.$app.api = {}
        $nuxt.$app.offline = true
        $nuxt.$app.count.api = 0
      }

      this.loaded.push('api')
    },

    //+-------------------------------------------------
    // updateMissing()
    // Builds an array of IDs that should be updated
    // Tries to follow similar logic than $game.needsUpdate()
    // -----
    // Created on Thu Apr 11 2024
    // Updated on Fri Dec 13 2024 - Accept requested
    //+-------------------------------------------------
    async updateMissing(requested = null) {
      debugger
      return
      let missing =
        requested ||
        Object.values(data)
          .filter((game) => {
            // const needsUpdate = $game.needsUpdate(game)
            // return needsUpdate !== false
            if (!game.id.steam) return false
            if (!game.id.api) return true
            // if (game.description == undefined) return true

            return false
          })
          .map((game) => game.id.steam)

      log('🪂 Updating missing games', missing)

      const xhr = await $nuxt.$axios.post(`get/batch`, { steam: missing })
      if (xhr.status) {
        log('🪂 Data from API', xhr.data)
        await this.process(xhr.data, 'api')
        return true
      }

      return false
    },

    //+-------------------------------------------------
    // init()
    // Initialize the data store
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    async init() {
      if (this.loaded.includes('init')) return

      $nuxt ??= useNuxtApp()
      $game ??= useGameStore()
      $cloud ??= useCloudStore()

      this.loaded.push('init')
      this.indexes = Object.keys(index)

      // Load and index local library
      await this.loadGames()
      await this.loadApiStatus()

      // Expose data to the window
      window.$data = {
        x: this,
        d: data,
        index,

        get: this.get,
        api: this.search,
        status: this.status,
        updateMissing: this.updateMissing,
      }

      // Finally, data is ready
      $nuxt.$mitt.emit('data:ready', '🟢 Go!')

      log('💽 Data is ready to use', {
        data: Object.keys(data).length,
        library: index.lib.length,
      })
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
