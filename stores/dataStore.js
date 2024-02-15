/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Thu Feb 15 2024
 */

let $nuxt = null
let $game = null

//+-------------------------------------------------
// Data sources
// ---
// Data is the complete list of games loaded by the app
// Updated every time a repository is loaded or a game is added
// ---
// Buffer is a top-list of games fetch from the api
// ---
// All items are indexed by uuid
//+-------------------------------------------------

let data = {}
let buffer = {}

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

  // api: {},
  // gog: {},
  // epic: {},
  // igdb: {},
  steam: {},
}

export const useDataStore = defineStore('data', {
  state: () => ({
    queue: [],
    loaded: [],
    indexes: [],
  }),

  getters: {
    libLatest() {
      // let games = await $nuxt.$db.games
      //   .orderBy('created_at')
      //   .reverse()
      //   .limit(10)
      //   .toArray()
      return index.lib.sort((a, b) => b.created_at - a.created_at).slice(0, 30)
    },
  },

  //+-------------------------------------------------
  // Methods to load data
  // * loadLibrary()
  // * loadApiStatus()
  //
  // Methods to retrieve data
  // * list()
  // * library()
  // * get()
  //
  // Methods to Query the API
  // * search()
  // * getTop() <-- belongs to a repository store
  //
  // Methods to persist data
  // * store() <-- Stores an array of items and updates indexes
  // * updateAndQueue() <-- updates local data and add it to queue
  // * delete() <-- Deletes an item from the database
  //
  // Utilities to manage data
  // * prepareToStore()
  // * toData()
  // * toIndex()
  // * toQueue()
  // * isIndexed()
  //+-------------------------------------------------

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
        // 'States': Object.keys(states).length,
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
        '-- Queue --': '----',
        'Queue': this.queue.length,
      })

      console.warn(index['steam'][440], data[index['steam'][440]])
    },

    //+-------------------------------------------------
    // list()
    // Returns the whole data object
    // -----
    // Created on Tue Nov 21 2023
    //+-------------------------------------------------
    list() {
      return data
    },

    //+-------------------------------------------------
    // library()
    // Returns the library object
    // TODO: work with array, should return array with data
    // -----
    // Created on Mon Dec 25 2023
    // Updated on Wed Feb 14 2024 - Library is now an index
    //+-------------------------------------------------
    library(as = 'array') {
      let library = [...index.lib]

      if (as == 'object') {
        return Object.fromEntries(
          library.filter((uuid) => Boolean(data[uuid])).map((uuid) => [uuid, data[uuid]])
        )
      }

      return library.map((uuid) => data[uuid]).filter(Boolean)
    },

    //+-------------------------------------------------
    // get()
    // Get an element by uuid
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    get(uuid) {
      return (
        data[uuid] || {
          uuid: uuid,
          error: 'missing',
        }
      )
    },

    //+-------------------------------------------------
    // search(hash)
    // Performs a search against the api
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    async search(hash) {
      if (search[hash]) {
        log('🛑 Search', hash, 'already done to the api')
        return
      }

      search[hash] = true
      const jxr = await $nuxt.$axios.get(`repository/${hash}.json`)
      if (jxr.status) {
        log('Search', hash, jxr.data)

        await this.toData(jxr.data, 'api')
      }
    },

    //+-------------------------------------------------
    // getTop()
    // NOTE: Belongs to a repository store
    // -----
    // Created on Wed Dec 20 2023
    //+-------------------------------------------------
    async getTop(batch) {
      if (!batch) return
      if (this.loaded.includes(`top:${batch}`)) return

      const jxr = await $nuxt.$axios.get(`repository/top-${batch}.json`)
      if (jxr.status) {
        this.toData(jxr.data, 'api')
        this.loaded.push(`top:${batch}`)
      }
    },

    // //+-------------------------------------------------
    // // update()
    // // Updates an app in memory and adds it to the queue
    // // Tries to find the app in the api index
    // // TODO: split this in two methods, search and update
    // // -----
    // // Created on Fri Nov 24 2023
    // // Created on Wed Nov 29 2023
    // //+-------------------------------------------------
    // update(item, uuid, force = false) {
    //   let ref = uuid
    //   let local = null

    //   if (!force && index.ed.includes(item.uuid)) return

    //   // Tries to find the app in the library by IDs
    //   // If the app is found, update the library, data and store
    //   // Otherwise, add the app to the data
    //   //+-------------------------------------------------
    //   // console.warn('🔎 Searching in Library for', item.name)

    //   for (const i in library) {
    //     let lib = library[i]
    //     // console.warn('Checking', JSON.stringify(lib), 'against', JSON.stringify(item))
    //     // console.warn(`Is ${lib.name} - ${item.name} ?` , lib.uuid,  item.uuid)

    //     // tries to find the app by store references
    //     // This is friendly called 'store dancing'
    //     // 🤞 Trust coaerced values
    //     //+-------------------------------------------------
    //     // this.indexes.forEach((store) => {
    //     //   if (lib[store + '_id'] && lib[store + '_id'] == item[store + '_id']) {
    //     //     ref = lib.uuid
    //     //     console.warn('🔎🔎 Found by', store + '_id', ref)
    //     //     console.warn(store, lib[store + '_id'], item[store + '_id'])
    //     //     return
    //     //   }
    //     // })

    //     for (const store of this.indexes) {
    //       if (lib[store + '_id'] && lib[store + '_id'] == item[store + '_id']) {
    //         if (lib.is?.ignored) return

    //         ref = lib.uuid
    //         console.warn(item.name, '🔎 Found by', store + '_id', ref)
    //         // console.warn(store, lib[store + '_id'], item[store + '_id'])
    //         break
    //       }
    //     }
    //   }

    //   // If the app is not found, just add it to data
    //   // There is no need to update
    //   //+-------------------------------------------------
    //   if (uuid == 'add' && ref == 'add') {
    //     // console.warn('⬅️ Adding to data and exit: ', item.name)
    //     let add = { ...item }
    //     add.api_id = item.uuid

    //     data[item.uuid] = add
    //     this.toIndex(add)
    //     return
    //   }

    //   // The local reference is not found
    //   if (!data[ref] || !ref) return

    //   console.groupCollapsed()
    //   console.error('make a cosole.table or console.group')
    //   console.warn('Processing app (from -> to)')
    //   console.warn(JSON.stringify(item))
    //   console.warn(ref)
    //   console.warn(JSON.stringify(data[ref]))

    //   //+-------------------------------------------------
    //   // 🌿 Updating data
    //   //+-------------------------------------------------

    //   let toQueue = uuid && uuid.length > 5 ? true : false

    //   // Determine if the updates should be
    //   // Added to the queue and saved in $db
    //   if (!data[ref].api_id && item.api_id) toQueue = true
    //   if (data[ref].updated_at < item.updated_at) toQueue = true
    //   if (uuid == 'state') {
    //     toQueue = true
    //   }

    //   local = { ...data[ref], ...item }
    //   local.uuid = data[ref].uuid

    //   if (local.api_id !== item.uuid) {
    //     local.api_id = item.uuid
    //   }

    //   console.warn('Result: ', local)
    //   console.warn('Adding to queue?', toQueue)
    //   console.groupEnd()
    //   // Save and index the app
    //   // Maybe $mitt.emit('data:updated', 'updated', local)
    //   data[ref] = { ...local }
    //   library[ref] = { ...local }

    //   this.toIndex(local)
    //   if (toQueue) this.toQueue(local)
    // },

    //+-------------------------------------------------
    // prepareToStore()
    // to ensureconsistency, add base values to the item
    // and remove unwanted values before returning back
    // -----
    // Created on Thu Dec 14 2023
    //+-------------------------------------------------
    prepareToStore(item, mode) {
      item.uuid = item.uuid || $nuxt.$uuid()
      item.is = item.is || { in: {} }
      item.is.in = item.is.in || {}
      item.log = item.log || []

      if (mode !== 'toIgnore') {
        if (mode) item.is.in[mode] = dates.now()

        item.playtime = item.playtime || {}
        item.updated_at = item.updated_at || 0
        item.last_played = item.last_played || {}
      }

      item.created_at = item.created_at || dates.now()
      ;['will_import', 'will_update', 'will_ignore'].forEach((prop) => {
        if (item[prop]) delete item[prop]
      })

      delete item.is.lib

      return item
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

      items = items.map((item) => {
        let prep = this.prepareToStore(item)

        data[item.uuid] = { ...prep }
        // library[item.uuid] = { ...prep }

        this.toIndex(prep)
        return prep
      })

      if (items.length == 1) $nuxt.$db.games.put(items[0])
      else $nuxt.$db.games.bulkPut(items)

      // $nuxt.$db.games.bulkPut(items)
      // this.toData(items, 'library')

      log(
        '🎴 Data updated',
        `added ${items.length} apps`,
        items[Math.floor(Math.random() * items.length)]
      )
    },

    // //+-------------------------------------------------
    // // save()
    // // Saves a single item in the database
    // // Update library and data arrays when match
    // // -----
    // // Created on Fri Jan 12 2024
    // //+-------------------------------------------------
    // save(item) {
    //   let _item = this.prepareToStore(item)

    //   data[item.uuid] = { ..._item }
    //   library[item.uuid] = { ..._item }

    //   this.toIndex(_item)

    //   $nuxt.$db.games.put(_item)
    // },

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
      delete index.steam[item.steam_id]

      // update counters
      $nuxt.$app.count.data = Object.keys(data).length || 0
      $nuxt.$app.count.library = index.lib.length || 0

      // Emits event
      $nuxt.$mitt.emit('data:deleted', uuid)
    },

    //+-------------------------------------------------
    // toIndex()
    // Adds each uuid to their respective store index
    // -----
    // Created on Thu Nov 30 2023
    //+-------------------------------------------------
    toIndex(item) {
      // Temporary disabled
      // if (item.api_id) index.api[item.api_id] = item.uuid
      // if (item.gog_id) index.gog[item.gog_id] = item.uuid
      // if (item.epic_id) index.epic[item.epic_id] = item.uuid
      // if (item.igdb_id) index.igdb[item.igdb_id] = item.uuid
      if (item.steam_id) index.steam[item.steam_id] = item.uuid

      index.ed.push(item.uuid)

      // index.api[item.api_id] = index.api[item.api_id] || item.uuid
      // index.steam[item.steam_id] = index.steam[item.steam_id] || item.uuid
    },

    //+-------------------------------------------------
    // isIndexed()
    // Tries to find an item in data
    // Returns uuid of data when found
    // -----
    // Created on Thu Jan 11 2024
    //+-------------------------------------------------
    isIndexed(item) {
      let exists = false
      if (index.ed.includes(item.uuid)) return true

      for (const store of this.indexes) {
        if (item[store + '_id'] && index[store][item[store + '_id']]) {
          // console.warn(
          //   `🔥 ${item.name} is already indexed on ${store}`,
          //   index[store][item[store + '_id']],
          //   item
          // )

          return index[store][item[store + '_id']]
        }
      }

      return false

      // console.warn(item)
    },

    // //+-------------------------------------------------
    // // updateAndQueue()
    // //
    // // -----
    // // Created on Thu Jan 11 2024
    // //+-------------------------------------------------
    // updateAndQueue(uuid, api) {
    //   if (uuid === true) return

    //   let local = null
    //   let toUpdate = false
    //   let app = library[uuid]

    //   if (app == undefined) {
    //     debugger
    //     console.warn('🛑 App not found in library', uuid)
    //   }

    //   if (!app.api_id) toUpdate = true
    //   if (app.updated_at < api.updated_at) toUpdate = true

    //   if (app.is?.ignored) toUpdate = false

    //   if (!toUpdate) return

    //   local = { ...app, ...api }
    //   local.uuid = app.uuid

    //   if (local.api_id !== api.uuid) {
    //     local.api_id = api.uuid
    //   }
    //   console.warn(local, api)

    //   // Save and index the app
    //   // Maybe $mitt.emit('data:updated', 'updated', local)
    //   data[app.uuid] = { ...local }
    //   library[app.uuid] = { ...local }

    //   console.warn('🌈 Updating app in db', local)
    //   this.toQueue(local)
    // },

    //+-------------------------------------------------
    // toData()
    // Adds apps to window.data
    // Then adds the app to the indexes
    // -----
    // Created on Tue Nov 21 2023
    // Updated on Tue Jan 30 2024
    //+-------------------------------------------------
    async toData(items) {
      if (!items.length) items = [items]
      console.warn('🆙🆙🆙 Adding toData', items.length)

      items.forEach((item) => {
        // if (item.steam_id == '292030') {
        // console.warn('✨ ', item)
        //   debugger
        // }
        let uuid = this.isIndexed(item)

        if (item.is?.lib || !uuid) {
          data[item.uuid] = { ...item }
        } else $game.update(uuid, item)

        this.toIndex(item)
      })

      console.warn('🌈 data:updated', items.length)

      $nuxt.$mitt.emit('data:updated', 'loaded')
      $nuxt.$app.count.data = Object.keys(data).length || 0

      return
      Object.values(items).forEach((item) => {
        if (source == 'library') {
          data[item.uuid] = item
          this.toIndex(item, false)
        }

        if (source == 'api') {
          this.update(item, 'add')
        }
        // let exists = false

        // this.indexes.forEach((store) => {
        //   if (item[store + '_id']) {
        //     // If there is already an item indexed for that store
        //     // Update the item with new data
        //     // (shouldnt happen often,  only on api calls)
        //     if (index[store][item[store + '_id']]) {
        //       if (item.uuid == index[store][item[store + '_id']]) return

        //       console.warn('Element is already indexed on', store, item)
        //       console.warn(item.uuid, '(API) -> (L)', index[store][item[store + '_id']])
        //       this.update(item, index[store][item[store + '_id']])
        //       exists = true
        //     }
        //   }
        // })

        // if (exists == false) {
        //   data[item.uuid] = item
        // }
      })

      $nuxt.$mitt.emit('data:updated', 'loaded')
    },

    // //+-------------------------------------------------
    // // toQueue()
    // // Thanks copilot
    // // todo: This should be a debounced function
    // // -----
    // // Created on Wed Nov 29 2023
    // //+-------------------------------------------------
    // toQueue(app, run = true) {
    //   if (this.queue.includes(app.uuid)) return

    //   this.queue.push(app.uuid)

    //   if (run) this.runQueue()
    // },

    async runQueue() {
      // Calls api to get the apps in queue
      if (this.queue.length == 0) return

      setTimeout(async () => {
        console.log('📦 Saving queue', this.queue.length)

        let toSave = []
        this.queue.forEach((uuid) => {
          toSave.push(data[uuid])
        })

        if (this.queue.length < 4) console.log('📦 Queue: ', toSave)

        await $nuxt.$db.games.bulkPut(toSave)
        $nuxt.$toast.success('Saved queue of ' + this.queue.length, {
          // description: 'Monday, January 3rd at 6:00pm',
        })

        this.queue = []
      }, 5000)
    },

    //+-------------------------------------------------
    // updateMissing()
    // Search for apps without api_id and call the api
    // to get the data and update the $db
    // -----
    // Created on Sat Nov 25 2023
    //+-------------------------------------------------
    async updateMissing() {
      console.warn('WIP')
      return
      let missing = {}
      let items = await $nuxt.$db.games
        .filter((game) => game.api_id === undefined)
        .toArray()

      items.forEach((item) => {
        this.indexes.forEach((store) => {
          if (item[store + '_id']) {
            if (missing[store] === undefined) missing[store] = []
            missing[store].push(item[store + '_id'])
          }
        })
      })

      if (Object.keys(missing).length > 0) {
        const jxr = await $nuxt.$axios.post(`get/batch`, missing)
        if (jxr.status) return jxr.data.forEach((item) => this.update(item))
      }
    },

    // 🔥 Moved to statesstore, delete this
    // //+-------------------------------------------------
    // // loadStates()
    // // Loads the states from the database into memory
    // // NOTE: Might be moved to stateStore
    // // -----
    // // Created on Mon Nov 27 2023
    // //+-------------------------------------------------
    // async loadStates() {
    //   if (this.loaded.includes('states')) return

    //   states = await $nuxt.$db.states.toArray()

    //   this.loaded.push('states')

    //   log(
    //     '❇️ User states are ready',
    //     `found ${states.length} states`,
    //     states[Math.floor(Math.random() * states.length)]
    //   )
    // },

    //+-------------------------------------------------
    // loadLibrary()
    // Loads the entire library from indexedDB into memory
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async loadLibrary() {
      if (this.loaded.includes('library')) return

      let games = await $nuxt.$db.games.toArray()
      games = games.map((game) => {
        game.is = game.is || {}
        game.is.lib = true
        return game
      })

      index.lib = games.map((game) => game.uuid)

      this.toData(games)
      this.loaded.push('library')
      $nuxt.$app.count.library = games.length || 0

      log(
        '🎴 Library loaded',
        `${games.length} apps in local DB`,
        games[Math.floor(Math.random() * games.length)]
      )
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

      const jxr = await $nuxt.$axios.get(`get/status.json`)
      if (jxr.status) {
        $nuxt.$app.api = jxr.data
        $nuxt.$app.count.api = jxr.data?.games?.total || 0
        this.loaded.push('api')
      }
    },

    //+-------------------------------------------------
    // init()
    // Initialize the data store
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    async init() {
      if (this.loaded.includes('init')) return

      if (!$nuxt) $nuxt = useNuxtApp()
      if (!$game) $game = useGameStore()

      this.loaded.push('init')
      this.indexes = Object.keys(index)

      // Load and index local library
      await this.loadLibrary()

      // await this.updateStale()
      // await this.updateMissing()

      // Expose data to the window
      window.db = {
        d: data,
        index,

        get: this.get,
        api: this.search,
        status: this.status,
        getTop: this.getTop,
      }

      // Finally, data is ready
      console.warn('🌈 data:ready')
      $nuxt.$mitt.emit('data:ready')

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
