/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Tue Nov 28 2023
 */

//+-------------------------------------------------
// Data repositories
// Those arrays hold objects of games from multiple sources
// Data is the complete list of games available to search
// Is the complete list of Local and API data
// Data is updated every time a repository is loaded or a game is added
// ---
// Library is loaded on init and updated when a game is added
// Index are updated on init and when a repository is loaded
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
  // api: {},
  steam: {},
  epic: {},
}

let $nuxt = null

export const useDataStore = defineStore('data', {
  state: () => ({
    queue: [],
    loaded: [],
    indexes: [],

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
        '-- Data --': '----',
        'Data': Object.keys(data).length,
        'States': Object.keys(states).length,
        'Library': Object.keys(library).length,
        'Wishlist': Object.keys(wishlist).length,
        '-- Repos --': '----',
        'Repos': Object.keys(repos).join(', '),
        'Search': Object.keys(search).join(', '),
        '-- Index --': '----',
        'Epic': Object.keys(index.epic).length,
        'Steam': Object.keys(index.steam).length,
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
    // search(hash)
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    async search(hash) {
      if (search[hash]) return
      // let $nuxt = useNuxtApp()

      const jxr = await $nuxt.$axios.get(`repository/${hash}.json`)
      if (jxr.status) {
        console.warn('Search', hash, jxr.data)
        this.addToData(jxr.data, 'api')
      }

      search[hash] = true
    },

    // faker() {
    //   let $nuxt = useNuxtApp()
    //   $nuxt.$mitt.emit('data:updated', 'yep')
    //   let uuid = null
    //   // create 20 fake elements to data
    //   for (let i = 0; i < 20; i++) {
    //     uuid = $nuxt.$uuid()

    //     data[uuid] = {
    //       uuid: uuid,
    //       name: `Faker game ${i}`,
    //       api_id: Math.floor(Math.random() * 10000) * 100,
    //       steam_id: Math.floor(Math.random() * 10000),
    //       epic_id: Math.floor(Math.random() * 10000),
    //     }
    //   }
    // },

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
      // let $nuxt = useNuxtApp()

      library = await $nuxt.$db.games.toArray()
      this.addToData(library, 'library')
      this.loaded.push('library')

      log(
        '🎴 User library is ready',
        `found ${library.length} apps`,
        library[Math.floor(Math.random() * library.length)]
      )
    },

    //+-------------------------------------------------
    // addToData()
    // Adds an array of items to data
    // -----
    // Created on Tue Nov 21 2023
    //+-------------------------------------------------
    async addToData(items, source) {
      // let $nuxt = useNuxtApp()

      items.forEach((item) => {
        let exists = false
        this.indexes.forEach((store) => {
          if (item[store + '_id']) {
            // If there is already an item indexed for that store
            // Update the item with new data (shouldnt happen only on api calls)
            if (index[store][item[store + '_id']]) {
              console.warn(
                'Element is already indexed',
                store,
                item,
                index[store][item[store + '_id']]
              )
              this.updateApp(item, index[store][item[store + '_id']])
              exists = true
            }
          }
        })

        if (exists == false) {
          // index.api[item.api_id] = index.api[item.api_id] || item.uuid
          index.steam[item.steam_id] = index.steam[item.steam_id] || item.uuid
          data[item.uuid] = item
        }
      })

      $nuxt.$mitt.emit('data:updated', 'loaded')
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    updateApp(item, uuid) {
      let update = false

      this.indexes.forEach((store) => {
        if (index[store][item[store + '_id']]) {
          update = index[store][item[store + '_id']]
        }
      })

      if (!update) return
      let local = data[update]

      // Append the uuid to a queue to save updated items
      if (!local.updated_at || local.updated_at < item.updated_at) {
        this.queue.push(update)
      }

      // Update the app in memory
      data[update] = {
        ...local,
        ...item,
        api_id: item.uuid,
        uuid: local.uuid,
      }

      console.warn('Updated', data[update])
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
      // let $nuxt = useNuxtApp()

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
        if (jxr.status) return jxr.data.forEach((item) => this.updateApp(item))
      }
    },

    async init() {
      if (this.loaded.includes('init')) return

      $nuxt = useNuxtApp()
      this.loaded.push('init')
      this.indexes = Object.keys(index)

      await this.loadStates()
      await this.loadLibrary()
      await this.updateMissing()

      window.db = {
        data,
        library,
        repos,
        search,
        index,
        status: this.status,
      }

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
