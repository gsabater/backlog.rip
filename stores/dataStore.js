/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Wed Nov 22 2023
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
// index
// Hold indexed values for each of the stores
//+-------------------------------------------------

let index = {
  api: {},
  steam: {},
  epic: {},
}

import { useRepositoryStore } from './RepositoryStore'

export const useDataStore = defineStore('data', {
  state: () => ({
    loaded: [],

    meta: {
      time: 0,
      timeout: 5 * 60 * 1000,
      loading: false,
    },
  }),

  actions: {
    status() {
      console.warn('Data satus')
      console.log('Data', data)

      console.table({
        'Loaded': this.loaded,
        '--': '--',
        'Data': Object.keys(data).length,
        'Library': Object.keys(library).length,
        'Wishlist': Object.keys(wishlist).length,
        '---': '---',
        'API': Object.keys(index.api).length,
        'Epic': Object.keys(index.epic).length,
        'Steam': Object.keys(index.steam).length,
      })
    },

    faker() {
      let $nuxt = useNuxtApp()
      let uuid = null
      // create 20 fake elements to data
      for (let i = 0; i < 20; i++) {
        uuid = $nuxt.$uuid()

        data[uuid] = {
          uuid: uuid,
          name: `Faker game ${i}`,
          api_id: Math.floor(Math.random() * 1000),
          steam_id: Math.floor(Math.random() * 1000),
          epic_id: Math.floor(Math.random() * 1000),
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
      let $nuxt = useNuxtApp()

      library = await $nuxt.$db.games.toArray()
      this.addToData(library)

      log(
        '🎴 User library is ready',
        library[Math.floor(Math.random() * library.length)],
        library.length
      )
    },

    //+-------------------------------------------------
    // addToData()
    // Just adds items from sources to the data array
    // -----
    // Created on Tue Nov 21 2023
    //+-------------------------------------------------
    addToData(source) {
      source.forEach((item) => {
        index.api[item.api_id] = index.api[item.api_id] || item.uuid
        index.steam[item.steam_id] = index.steam[item.steam_id] || item.uuid

        data[item.uuid] = item
      })
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
    // function()
    //
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    async get(appID) {
      console.warn(app)
      console.warn(app.$axios)
      console.warn(app.$db)
      let value = await app.$db.value('config', 'me')
      return [data[appID], value]
    },

    test() {
      data.c = 'pepc'
      data[440] = {
        appid: 440,
      }
      console.log(data)
    },

    //+-------------------------------------------------
    // topGames()
    // Created on Wed Apr 26 2023
    //+-------------------------------------------------
    async topGames(params) {
      // const jxr = await app.$axios.get(`repository/top-games`)
      // if (jxr.status) return jxr.data
    },

    async init() {
      await this.loadLibrary()
      this.faker()
      // console.log(data, library)

      window.db = {
        data,
        library,
        index,
        status: this.status,
      }

      log('💽 Data is ready to use', {
        data: Object.keys(data).length,
        library: Object.keys(library).length,
      })

      // this.isReady = true
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
