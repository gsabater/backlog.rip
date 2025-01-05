/*
 * @file:    \stores\searchStore.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th September 2024
 * Modified: Sun 05 January 2025 - 17:58:52
 */

import search from '~/services/searchService'

let $nuxt = null
let $data = null

// Hashed
// Stores instances for each search performed
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let hashed = {}

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
    //+-------------------------------------------------
    // getSource()
    // Returns the source to use in the search
    // -----
    // Created on Wed Jul 24 2024
    //+-------------------------------------------------
    getSource(filters) {
      // Source is an array of fixed items
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (Array.isArray(filters.source) && filters.source.length)
        return { type: 'array', apps: filters.source }

      // Source is all games
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters.source == 'all') return { type: 'all', apps: $data.list() }

      // The source is the library but...
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let type = filters.is ?? 'library'
      let apps = null

      if (!filters.is) apps = $data.library('object')
      if (filters.is == 'pinned') apps = $data.pinned('object')
      if (filters.is == 'hidden') apps = $data.hidden('object')
      if (filters.is == 'favorites') apps = $data.library('object')

      return { type, apps }
    },

    //+-------------------------------------------------
    // getHash()
    // Generates an unique hash to identify a search instance
    // -----
    // Created on Sun Jan 05 2025
    //+-------------------------------------------------
    getHash(source, filters) {
      if (source.type == 'array') return null

      let f = {
        string: filters.string,
        sortBy: filters.sortBy,
        released: filters.released,
        genres: filters.genres,
        states: filters.states,
      }

      let json = JSON.stringify(f)
      let base = btoa(json)
      let hash = source.type + '#' + Object.keys(source.apps).length + ':' + base

      return hash
    },

    //+-------------------------------------------------
    // run()
    // Performs a search using a filter object
    // -----
    // Created on Sun Jan 05 2025
    //+-------------------------------------------------
    run(filters) {
      this.loading = true

      let source = this.getSource(filters)
      let hash = this.getHash(source, filters)

      let filtered = null
      let paginated = null

      log(`⇢ Search ${hash} 🔸`)
      log(JSON.stringify(filters))

      this.stats.start = performance.now()
      this.stats.apps = Object.keys(source.apps).length
      if (source.type == 'all') this.stats.apps = $nuxt.$app.count.api

      filtered = this.filter(hash, source, filters)
      paginated = search.paginate(filtered.items, filters.show)
      // const searched = search.filter(source, filters, { source: source })
      // items.value = search.paginate(searched.items, filters.show)

      this.stats.end = performance.now()
      this.stats.results = filtered.results
      this.stats.filtered = filtered.filtered || 0

      this.history.items = filtered.items
      return {
        hash,
        items: paginated,
      }
    },

    //+-------------------------------------------------
    // filter()
    // Calls for filter to the service,
    // Then stores and returns the results for subsequent use
    // -----
    // Created on Sun Jan 05 2025
    //+-------------------------------------------------
    filter(hash, source, filters) {
      if (hashed[hash]) return hashed[hash]

      let filtered = search.filter(source.apps, filters)
      hashed[hash] = filtered
      log(`⇢ Hashed ${hash} 🔸`)

      return filtered
    },

    //+-------------------------------------------------
    // visibleProps()
    // Returns a an array of properties for game items
    // based on the user selection and the sortBy
    // -----
    // Created on Tue Dec 31 2024
    //+-------------------------------------------------
    visibleProps(filters) {
      let selected = JSON.parse(JSON.stringify(filters?.show?.card ?? []))

      if (selected.length == 1 && selected.includes('default')) {
        if (filters.sortBy == 'score') {
          selected.push('score')
        }

        if (filters.sortBy == 'released') {
          selected.push('released')
        }

        if (filters.sortBy == 'playtime') {
          selected.push('playtime')
        }

        if (filters.sortBy == 'hltb') {
          selected.push('hltb')
        }
      }

      return selected
    },

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
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()

      if (window) window.$search = { x: this, h: hashed }
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
