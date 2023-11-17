/*
 * @file:    \stores\RepositoryStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd November 2023
 * Modified: Fri Nov 17 2023
 */

let app = null

export const useRepositoryStore = defineStore('productos', {
  state: () => ({
    items: [],

    meta: {
      time: 0,
      timeout: 5 * 60 * 1000,
      loading: false,
    },
  }),

  getters: {
    // upper() {
    //   return this.message.toUpperCase();
    // },
  },

  actions: {
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
  import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))
}
