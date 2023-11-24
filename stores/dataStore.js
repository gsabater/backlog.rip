/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Fri Nov 24 2023
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
  api: {},
  steam: {},
  epic: {},
}

export const useDataStore = defineStore('data', {
  state: () => ({
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
        'Library': Object.keys(library).length,
        'Wishlist': Object.keys(wishlist).length,
        '-- Repos --': '----',
        'Repos': Object.keys(repos).join(', '),
        'Search': Object.keys(search).join(', '),
        '-- Index --': '----',
        'API': Object.keys(index.api).length,
        'Epic': Object.keys(index.epic).length,
        'Steam': Object.keys(index.steam).length,
      })

      console.warn(data[index['steam'][440]])
    },

    faker() {
      let $nuxt = useNuxtApp()
      $nuxt.$mitt.emit('data:updated', 'yep')
      let uuid = null
      // create 20 fake elements to data
      for (let i = 0; i < 20; i++) {
        uuid = $nuxt.$uuid()

        data[uuid] = {
          uuid: uuid,
          name: `Faker game ${i}`,
          api_id: Math.floor(Math.random() * 10000) * 100,
          steam_id: Math.floor(Math.random() * 10000),
          epic_id: Math.floor(Math.random() * 10000),
        }
      }
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
      let $nuxt = useNuxtApp()

      library = await $nuxt.$db.games.toArray()
      this.addToData(library, 'library')
      this.loaded.push('library')

      this.faker()
      console.log(123)
      log(
        '🎴 User library is ready',
        library[Math.floor(Math.random() * library.length)],
        library.length
      )
    },

    loadRepository(repo) {
      // if (this.loaded.includes(repo)) return
      // // this.addToData(repo)
      // this.loaded.push(repo)
    },

    //+-------------------------------------------------
    // addToData()
    // Just adds items from sources to the data array
    // -----
    // Created on Tue Nov 21 2023
    //+-------------------------------------------------
    async addToData(items, source) {
      let $nuxt = useNuxtApp()

      items.forEach((item) => {
        let insert = true

        if (source == 'api') {
          this.indexes.forEach((store) => {
            if (item[store + '_id']) {
              // If the item is already in the data array
              // we need to delete the old one and replace it
              // also fix the indexes
              if (index[store][item[store + '_id']]) {
                this.updateLibrary(item, index[store][item[store + '_id']])
                insert = false
                console.log('Update', item, insert)
              }
            }
          })
        }

        index.api[item.api_id] = index.api[item.api_id] || item.uuid
        index.steam[item.steam_id] = index.steam[item.steam_id] || item.uuid

        if (insert) data[item.uuid] = item
        console.log('inserting', item, insert)
      })
      $nuxt.$emit('repository', 'loaded')
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
      let $nuxt = useNuxtApp()

      const jxr = await $nuxt.$axios.get(`repository/${hash}.json`)
      if (jxr.status) {
        console.warn('Search', hash, jxr.data)
        this.addToData(jxr.data, 'api')
      }

      search[hash] = true
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
    // function()
    //
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    updateLibrary(item, uuid) {
      let $nuxt = useNuxtApp()

      let local = data[uuid]

      this.indexes.forEach((store) => {
        delete index[store][local[store + '_id']]
      })

      data[uuid] = { ...local, ...item, api_id: item.uuid, uuid: uuid }
    },

    async init() {
      if (this.loaded.includes('store')) return

      this.indexes = Object.keys(index)
      await this.loadLibrary()

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

      this.loaded.push('store')
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
