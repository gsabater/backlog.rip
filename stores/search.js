/*
 * @file:    \stores\searchStore.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th September 2024
 * Modified: Thu 26 September 2024 - 16:08:08
 */

let $nuxt = null

export const useSearchStore = defineStore('search', {
  state: () => ({
    loading: false,

    // History object
    // Used to store the last search state
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    stats: {
      apps: 0, // amount of apps as source
      results: 0, // amount of apps after filtering
      filtered: 0, // amount of apps filtered out

      start: 0, // time it took to filter and sort
      end: 0, // time it took to filter and sort

      api_start: 0, // time it took to filter and sort
      api_end: 0, // time it took to filter and sort

      api: 0, // time it took to filter and sort
      local: 0, // time it took to filter and sort
      time: 0, // time it took to filter and sort
    },

    // History object
    // Used to store the last search state
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    history: {
      hash: null,
      items: null,
    },
  }),

  actions: {
    setTime(time) {
      this.stats[time] = performance.now()

      if (time !== 'start') return
      this.stats.end = 0
      this.stats.api_end = 0
      this.stats.api_start = 0
    },
    //+-------------------------------------------------
    // init()
    // Initializes the search store
    // -----
    // Created on Thu Sep 26 2024
    //+-------------------------------------------------
    init() {
      if (window) window.$search = this
    },
  },

  getters: {
    time() {
      if (this.stats.api_end) return this.stats.api_end - this.stats.start
      return this.stats.end - this.stats.start
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
