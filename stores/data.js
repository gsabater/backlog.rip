/*
 * @file:    \stores\DataStore.js
 * @desc:    Handle operations related to data with their index
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: 19th November 2025 - 04:08:19
 */

import gameService from '../services/gameService'

let $app = null
let $log = null
let $nuxt = null
let $game = null
let $queue = null
let $cloud = null

//+-------------------------------------------------
// Data sources
// ---
// Data is the complete list of games loaded by the app
// Updated every time a repository is loaded or a game is added
//+-------------------------------------------------

let data = {}

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

//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Methods to manage data
// * process() <- entry point for new data

// Methods to load data
// * loadDatabaseGames()

// Methods to retrieve data
// * get() <-- element by uuid
// * list() <-- Returns the whole data object
// * library() <-- data where is.lib == true
// * pinned() <-- data where is.pinned == true
// * hidden() <-- data where is.hidden == true
// * getRandom() <-- Get random elements

// Methods to persist data
// * addToLibrary() <-- Adds an item to the library
// * store() <-- Stores an array of items and updates indexes

// * prepareToStore()
// * toData()
// * toIndex()
// * setIndex()
// * isIndexed()
// * inInLibrary()
// * countLibrary()
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

  actions: {
    //+-------------------------------------------------
    // process()
    // The main entry point of each app to become data
    // Operates as a semaphor for CRUD operations on apps
    // -----
    // Created on Tue Feb 25 2025
    //+-------------------------------------------------
    async process(apps, from, emit = true) {
      const items = Array.isArray(apps) ? apps : [apps]
      const events = new Set()

      // console.warn(
      //   '[DEV] Process',
      //   from,
      //   items.length,
      //   items[Math.floor(Math.random() * items.length)]
      // )

      for (const item of items) {
        if (!item?.uuid || item === true || (Array.isArray(item) && item.length === 0)) {
          console.error('🔥', item, from)
          continue
        }

        // Debugger
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (
          $app.wip &&
          // if (item.name == 'DOOM') {
          // if (from == 'add:new') {
          (item.uuid == '5c1c9b5a-1c02-4a56-85df-f0cf97929a48' ||
            item.uuid == '94327609-250d-4f98-93b3-cd380eb19a9b' ||
            item.uuid == '4434fa13-4f18-44ec-ad80-db412ba28a96')
        ) {
          // console.warn('✨ ' + item.name, item, from)
          // debugger
        }

        // if (from == 'updated') debugger
        // if (from !== 'library' && from !== 'api' && from !== 'updated') debugger
        // if (item.uuid == '338c704c-260e-44a6-b063-d541ef351fa8') debugger
        // if (item.id?.steam == 250900) debugger

        // Find the index in data
        let indexed = this.isIndexed(item)

        // Games coming from indexedDB are library
        // and will be added to data
        // console.warn(' ⇢ app to lib', item.uuid, item.name)
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (from === 'library') {
          if (indexed) dataService.deduplicate(item, indexed)
          else this.toData(item)
          continue
        }

        if (!from.includes) {
          console.warn(item, from)
          debugger
        }

        // Handle api items
        // Those apps come from the api
        // and are usually added to data
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (from === 'api' || from.includes('api:') || from.includes('list:')) {
          item.id = item.id || {}
          item.id.api = item.uuid

          if (from.includes('list:')) {
            if (!indexed) this.toData(item)
            events.add('data:added')
            continue
          }

          // If the game is already indexed and just
          // comes from the api, check if contains updates
          // console.warn(' ⇢ updating app from API', item.uuid, item.name)
          //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          if (indexed) {
            if (from.includes(':batch')) {
              item.dates = item.dates || {}
              item.dates.refreshed = dates.stamp()
              $game.update(indexed.uuid, item)
              continue
            }

            if (index.lib.includes(indexed.uuid)) {
              let app = this.get(indexed.uuid, false)
              const needsUpdate = gameService.needsUpdate(app, item)

              if (!needsUpdate) continue
              else $game.update(app, item)

              continue
            }

            // console.warn('⇢ app already indexed')
            else if (index.ed.includes(indexed.uuid)) {
              continue
            } else {
              // shouldnt happen
              debugger
            }
          }

          // Add not indexed API games to the pool
          // console.warn('⇢ app to data from API', item.uuid, item.name)
          //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          if (!indexed) {
            this.toData(item)
            events.add('data:added')
            continue
          }
        }

        // Import games
        // Those games come from plugins
        // console.warn(' ⇢ Imported app', item.uuid, item.name)
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Disabled because items will have .toStore, which is enough
        // if (from == 'import') {
        //   item.api_id = item.uuid
        //   this.toData(item)
        //   continue
        // }

        // Store an app
        // Usually after it has already been updated
        // console.warn(' ⇢ app to store (store:)', item.uuid, item.name)
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (from?.includes('store:') || item.toStore) {
          $queue.add(item.uuid)
          this.toData(item)

          // if (from?.includes('update:')) events.add('game:updated')
          // if (from?.includes('update:state')) events.add('game:updated')
          continue
        }

        // Update data
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (from?.includes('updated')) {
          this.toData(item)
          continue
        }

        // There is work to be done...
        debugger
      }

      if (!emit || !$app.ready) return

      await delay(100)

      // $mitt: A game has been updated
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (items.length == 1 && from?.includes('update:')) {
        $nuxt.$mitt.emit('game:updated', {
          uuid: items[0].uuid,
          from,
        })
      }

      // $mitt: A game has been added to data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (events.has('data:added')) {
        $nuxt.$mitt.emit('data:added', {
          from,
        })
      }

      // $nuxt.$mitt.emit('data:updated', `${items.length} items`)
      // console.debug(items[Math.floor(Math.random() * items.length)])
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
    // Counts the amount of games in the library (local DDBB)
    // filtering out hidden and non library items
    // -----
    // Created on Tue Jul 23 2024
    // Updated on Thu Jan 30 2025 - Update count values
    // Created on Fri Nov 07 2025 - Updated logic
    //+-------------------------------------------------
    countLibrary() {
      const library = index.lib.filter((uuid) => {
        const item = data[uuid]
        return item?.is?.lib && !item.is?.hidden
      })

      $app.count.library = library.length
    },

    //+-------------------------------------------------
    // get()
    // Get an element by uuid Maybe move to a getter
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    get(uuid) {
      if (!uuid) return
      if (data[uuid]) {
        return data[uuid]
      }

      // if (data[uuid]) return data[uuid]
      // if (index.api[uuid] && data[index.api[uuid]]) return data[index.api[uuid]]

      return {
        uuid: uuid,
        error: 'missing',
        character: 'pikachu',
        face: 'surprised',
      }
    },

    //+-------------------------------------------------
    // findBySource()
    // Returns an uuid or an app by its source and id
    // -----
    // Created on Mon Mar 24 2025
    //+-------------------------------------------------
    findBySource(source, id, as = 'app') {
      let uuid = index[source][id]
      if (as == 'uuid') return uuid

      return this.get(uuid, false)
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
    // addToLibrary()
    // Adds an item to the library
    // -----
    // Created on Fri Feb 28 2025
    //+-------------------------------------------------
    addToLibrary(uuid) {
      let app = data[uuid]

      if (!app) return
      if (app.is.lib) return

      app.is.lib = dates.stamp()
      this.process(app, 'store:toLibrary')
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
    async store(items) {
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

      if (prepared.length == 1) await $nuxt.$db.games.put(prepared[0])
      else await $nuxt.$db.games.bulkPut(prepared)

      $log(`[Data] Stored ${prepared.length} items`)
      console.debug('↪ ', prepared[Math.floor(Math.random() * prepared.length)])
    },

    //+-------------------------------------------------
    // delete()
    // deletes an item from the database
    // -----
    // Created on Wed Feb 14 2024
    // Updated on Wed Mar 05 2025 - Handle a batch of uuids
    //+-------------------------------------------------
    async delete(uuid) {
      if (!uuid) return

      // Convert single UUID to an array for uniform handling
      const uuids = Array.isArray(uuid) ? uuid : [uuid]
      console.warn('🔥 Deleting', uuids)

      // Delete from the database using Dexie's bulkDelete
      await $nuxt.$db.games.bulkDelete(uuids)

      // Delete from in-memory data structure
      uuids.forEach((id) => {
        let item = data[id]
        if (!item) return

        delete data[id]

        // Remove from indexes safely
        index.ed = index.ed.filter((e) => e !== id)
        index.lib = index.lib.filter((e) => e !== id)
        if (item.id.igdb) delete index.igdb[item.id.igdb]
        if (item.id.steam) delete index.steam[item.id.steam]
      })

      // Emits event
      $nuxt.$mitt.emit('data:deleted', { uuids })
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

      if (this.isLibrary(app) && !index.lib.includes(app.uuid)) {
        index.lib.push(app.uuid)
      }

      index.ed.push(app.uuid)
    },

    //+-------------------------------------------------
    // setIndex()
    // Sets an index with data from state
    // Notifies $app.count to update some counters
    // -----
    // Created on Wed Jul 24 2024
    //+-------------------------------------------------
    setIndex(key, app) {
      index[key] = app
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
      $queue.add(uuid)
      $queue.remove(local)

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
      for (const store of Object.keys(index)) {
        if (
          (item.id?.[store] && index[store][item.id[store]]) ||
          (item[store + '_id'] && index[store][item[store + '_id']])
        ) {
          return {
            index: store,
            uuid: index[store][item[store + '_id']] || index[store][item.id[store]],
          }
        }
      }

      // Check if item exists in the "ed" index by UUID
      if (item.uuid && index.ed.includes(item.uuid))
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
    //+-------------------------------------------------
    async toData(item) {
      // Prepare the game to be ingested
      let game = dataService.prepareToData({ ...item })

      // Add the items to be stored to the queue
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (game.is?.dirty || game.toStore || game.toSwap) {
        // if (game.toStore) queueService.queue(game.uuid)
        // if (game.toSwap) queueService.queue([game.toSwap, game.uuid], 'swap')

        // delete game.toStore
        // delete game.is.dirty
        console.warn('WIP NEW METHOD TOSTORE')
      }

      // Add it to data and index
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      data[game.uuid] = game
      this.toIndex(game)
    },

    //+-------------------------------------------------
    // emptyLibrary()
    // Empties the library, clearing Dexie DB and related indexes
    // -----
    // Created on Fri Sep 13 2024
    // Created on Fri Apr 11 2025 - Improved reindexing
    //+-------------------------------------------------
    async emptyLibrary() {
      let library = this.library()

      library.forEach((item) => {
        delete data[item.uuid]

        // Delete indexes
        // delete index.ed[index.ed.indexOf(item.uuid)]
        // delete index.igdb[item.id.igdb]
        // delete index.steam[item.id.steam]
      })

      // Clear Dexie DB
      await $nuxt.$db.games.clear()

      // Clear related indexes
      index.ed = []
      index.lib = []
      index.api = {}
      index.igdb = {}
      index.epic = {}
      index.steam = {}

      index.fav = []
      index.pinned = []
      index.hidden = []

      this.loaded = this.loaded.filter((item) => item !== 'library')

      // Update counters
      // $app.count.library = 0
      this.countLibrary()
    },

    //+-------------------------------------------------
    // loadDatabaseGames()
    // Loads the entire library from indexedDB into memory
    // -----
    // Created on Fri Nov 17 2023
    // Updated on Sun Feb 25 2024
    //+-------------------------------------------------
    async loadDatabaseGames(reload = false) {
      if (this.loaded.includes('library') && !reload) return

      let games = await $nuxt.$db.games.toArray()

      await this.process(games, 'library')
      this.loaded.push('library')

      $log(`[ Data ] Loaded ${games.length} games`)
      console.debug(games[Math.floor(Math.random() * games.length)])
    },

    //+-------------------------------------------------
    // init()
    // Initialize the data store
    // -----
    // Created on Wed Nov 29 2023
    // Created on Sat Oct 04 2025 - Improved initialization
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()
      $game ??= useGameStore()

      $db ??= $nuxt.$db
      $app ??= $nuxt.$app
      $log ??= $nuxt.$log
      $queue ??= $nuxt.$queue

      if ($app.services.data) return

      // Build the index and load the local library
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.indexes = Object.keys(index)
      await this.loadDatabaseGames()

      // Finally, data is ready
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $nuxt.$mitt.emit('data:ready')
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
