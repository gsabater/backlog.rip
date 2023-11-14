/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Tue Nov 14 2023
 */

import { useRepositoryStore } from './RepositoryStore'

let data = []
const app = useNuxtApp()

export const useDataStore = defineStore('data', {
  state: () => ({
    meta: {
      time: 0,
      timeout: 5 * 60 * 1000,
      loading: false,
    },
  }),

  actions: {
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
      const jxr = await app.$axios.get(`repository/top-games`)
      if (jxr.status) return jxr.data
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
