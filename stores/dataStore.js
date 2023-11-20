/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Mon Nov 20 2023
 */

import { useRepositoryStore } from './RepositoryStore'

let data = []
let library = []
let wishlist = []

// const app = useNuxtApp()

export const useDataStore = defineStore('data', {
  state: () => ({
    isLoaded: false,

    meta: {
      time: 0,
      timeout: 5 * 60 * 1000,
      loading: false,
    },
  }),

  actions: {
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
      log('🎴 User library is ready', library[0], library.length)
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
      if (this.isLoaded) return

      await this.loadLibrary()
      log('💽 Repositories loaded')

      this.isLoaded = true
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
