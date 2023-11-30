/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Thu Nov 30 2023
 */

let $nuxt = null

//+-------------------------------------------------
// Data repositories
// Those arrays hold objects of games from multiple sources
// Data is the complete list of games available to search
// Data is updated every time a repository is loaded or a game is added
// ---
// Library is loaded on init and updated when a game is added
// ---
// All elements are indexed by uuid
//+-------------------------------------------------

let data = {}

let states = {}
let library = {}
let wishlist = {}

//+-------------------------------------------------
// repos
// Repositories are searches and preset filters
// They are stored in the database and can be updated
//+-------------------------------------------------

let repos = {}
let search = {}

//+-------------------------------------------------
// index
// Hold indexed values for each of the stores
//+-------------------------------------------------

let index = {
  ed: [],

  api: {},
  epic: {},
  igdb: {},
  steam: {},
}

export const useDataStore = defineStore('data', {
  state: () => ({
    queue: [],
    loaded: [],
    indexes: [],

    isReady: false,

    meta: {
      time: 0,
      timeout: 5 * 60 * 1000,
      loading: false,
    },
  }),

  //+-------------------------------------------------
  // 🛞 Actions
  //+-------------------------------------------------

  actions: {
    status() {
      console.warn('Data satus')
      console.log('Data', data)

      console.table({
        'Loaded': this.loaded.join(', '),
        'Indexes': this.indexes.join(', '),
        '-- Data --': '----',
        'Data': Object.keys(data).length,
        'States': Object.keys(states).length,
        'Library': Object.keys(library).length,
        'Wishlist': Object.keys(wishlist).length,
        '-- Repos --': '----',
        'Repos': Object.keys(repos).join(', '),
        'Search': Object.keys(search).join(', '),
        '-- Index --': '----',
        'Indexed': index.ed.length,
        'API': Object.keys(index.api).length,
        'Epic': Object.keys(index.epic).length,
        'Steam': Object.keys(index.steam).length,
        '-- Queue --': '----',
        'Queue': this.queue.length,
      })

      console.warn(data[index['steam'][440]])
    },

    //+-------------------------------------------------
    // list()
    // Returns the whole data array
    // -----
    // Created on Tue Nov 21 2023
    //+-------------------------------------------------
    list() {
      return data
    },

    //+-------------------------------------------------
    // get()
    // Get an element by uuid
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    async get(uuid) {
      return data[uuid]
    },

    //+-------------------------------------------------
    // states()
    // Returns the states array
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    states() {
      return states
    },

    //+-------------------------------------------------
    // search(hash)
    // Performs a search against the api
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    async search(hash) {
      if (search[hash]) return

      const jxr = await $nuxt.$axios.get(`repository/${hash}.json`)
      if (jxr.status) {
        console.warn('Search', hash, jxr.data)
        this.toData(jxr.data, 'api')
      }

      search[hash] = true
    },

    //+-------------------------------------------------
    // update()
    // Updates an app in memory and adds it to the queue
    // Tries to find the app in the api index
    // -----
    // Created on Fri Nov 24 2023
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    update(item, uuid) {
      let ref = uuid
      let local = null

      if (index.ed.includes(item.uuid)) return

      // Tries to find the app in the api index
      //+-------------------------------------------------
      if (!ref && index.api[item.uuid]) {
        ref = index.api[item.uuid]
      }

      // tries to find the app in other indexes
      // This is friendly called 'store dancing'
      //+-------------------------------------------------
      if (!ref) {
        this.indexes.forEach((store) => {
          if (store == 'api') return
          if (index[store][item[store + '_id']]) {
            ref = index[store][item[store + '_id']]
          }
        })
      }

      // The local reference is not found
      if (!data[ref] || !ref) return

      console.warn(
        'Updating app (from -> to)',
        JSON.stringify(item),
        ref,
        JSON.stringify(data[ref])
      )

      //+-------------------------------------------------
      // 🌿 Updating data
      //+-------------------------------------------------

      let toQueue = uuid ? true : false

      // Determine if the updates should be saved
      if (!data[ref].api_id) toQueue = true
      if (data[ref].updated_at < item.updated_at) toQueue = true

      local = { ...data[ref], ...item }
      local.uuid = data[ref].uuid

      if (local.api_id !== item.uuid) {
        local.api_id = item.uuid
      }

      console.warn('Updated', local)

      // Index resulting element
      this.toIndex(local)
      if (toQueue) this.toQueue(local.uuid)
      return
    },

    //+-------------------------------------------------
    // toIndex()
    //
    // -----
    // Created on Thu Nov 30 2023
    //+-------------------------------------------------
    toIndex(item, toIndexed = true) {
      if (item.api_id) index.api[item.api_id] = item.uuid
      if (item.igdb_id) index.igdb[item.igdb_id] = item.uuid
      if (item.steam_id) index.steam[item.steam_id] = item.uuid

      if (toIndexed) {
        index.ed.push(item.uuid)
      }

      // index.api[item.api_id] = index.api[item.api_id] || item.uuid
      // index.steam[item.steam_id] = index.steam[item.steam_id] || item.uuid
    },

    //+-------------------------------------------------
    // toQueue()
    // Thanks copilot
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    toQueue(uuid) {
      if (this.queue.includes(uuid)) return

      if (this.queue.length == 0) {
        setTimeout(() => {
          console.log('📦 Saving queue', this.queue.length)
          this.queue.forEach((uuid) => {
            console.log('📀 Saving', uuid, data[uuid].name || 'NN')
            console.log(
              'gonna copy data[uid] into library[uid] and save that into indexed '
            )
            // $nuxt.$db.games.update(uuid, data[uuid])
          })
          this.queue = []
        }, 2000)
      }

      this.queue.push(uuid)
    },

    //+-------------------------------------------------
    // toData()
    // Adds elements to window.data
    // -----
    // Created on Tue Nov 21 2023
    //+-------------------------------------------------
    async toData(items, source) {
      items.forEach((item) => {
        if (source == 'library') {
          data[item.uuid] = item
          this.toIndex(item, false)
        }

        if (source == 'api') {
          this.update(item)
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

    //+-------------------------------------------------
    // topGames()
    // Created on Wed Apr 26 2023
    //+-------------------------------------------------
    async topGames(params) {
      // const jxr = await app.$axios.get(`repository/top-games`)
      // if (jxr.status) return jxr.data
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

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Mon Nov 27 2023
    //+-------------------------------------------------
    async loadStates() {
      if (this.loaded.includes('states')) return

      states = await $nuxt.$db.states.toArray()

      this.loaded.push('states')

      log(
        '❇️ User states are ready',
        `found ${states.length} states`,
        states[Math.floor(Math.random() * states.length)]
      )
    },

    //+-------------------------------------------------
    // loadLibrary()
    // Loads the entire library of indexedDB into memory
    // Should be called again after an import process
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async loadLibrary() {
      if (this.loaded.includes('library')) return

      library = await $nuxt.$db.games.toArray()
      this.toData(library, 'library')
      this.loaded.push('library')

      log(
        '🎴 User library is ready',
        `found ${library.length} apps`,
        library[Math.floor(Math.random() * library.length)]
      )
    },

    //+-------------------------------------------------
    // init()
    // Initialize the data store
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    async init() {
      if (this.loaded.includes('init')) return

      $nuxt = useNuxtApp()
      this.loaded.push('init')
      this.indexes = Object.keys(index)

      // Load and index data
      await this.loadStates()
      await this.loadLibrary()
      await this.updateMissing()

      // Expose data to the window
      window.db = {
        d: {
          data,
          library,
          wishlist,
          states,
          repos,
          search,
          index,
        },
        // data,
        // library,
        // repos,
        // search,
        // index,
        api: this.search,
        status: this.status,
      }

      // Finally, data is ready
      this.isReady = true
      $nuxt.$mitt.emit('data:ready')

      log('💽 Data is ready to use', {
        data: Object.keys(data).length,
        library: Object.keys(library).length,
      })
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
