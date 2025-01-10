/*
 * @file:    \stores\searchStore.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th September 2024
 * Modified: Thu 09 January 2025 - 17:36:22
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

    // Latest
    // Hash used to identify the last search
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    latest: null,

    // Stats object
    // Used to display useful infromation about the search
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    stats: {
      apps: 0, // amount of apps as source
      results: 0, // amount of apps after filtering
      filtered: 0, // amount of apps filtered out

      showing: 0, // Amount of items being shown, usually page * perpage
      nextPage: 0, // Amount of items added by the next page

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
    // history: {
    //   hash: null,
    //   items: null,
    // },
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
    // makeHash()
    // Generates an unique hash to identify a search instance
    // -----
    // Created on Sun Jan 05 2025
    //+-------------------------------------------------
    makeHash(source, filters) {
      if (source.type == 'array') return null

      let f = {
        string: filters.string,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
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
    // getSearch()
    // Returns the search object for a given hash
    // -----
    // Created on Mon Jan 06 2025
    //+-------------------------------------------------
    getSearch(hash) {
      if (!hash) hash = this.latest
      return hashed[hash] ?? null
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
      let hash = this.makeHash(source, filters)

      let filtered = null
      let paginated = null

      log(`⇢ Search ${hash} 🔸`)
      log(JSON.stringify(filters))

      this.stats.start = performance.now()
      this.stats.apps = Object.keys(source.apps).length
      if (source.type == 'all') this.stats.apps = $nuxt.$app.count.api

      this.onAPI(source, filters)
      filtered = this.filter(hash, source, filters)
      paginated = search.paginate(filtered.items, filters.show)
      // const searched = search.filter(source, filters, { source: source })
      // items.value = search.paginate(searched.items, filters.show)

      this.stats.end = performance.now()
      this.stats.results = filtered.results
      this.stats.filtered = filtered.filtered || 0

      this.stats.showing = search.calcShowing(filters, filtered.results)
      this.stats.nextPage = search.calcNextPage(filters, filtered.results)

      this.loading = false
      log('⇢ search:end', this.stats)

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
      this.latest = hash
      if (hashed[hash]) return hashed[hash]

      let filtered = search.filter(source.apps, filters)
      hashed[hash] = filtered
      log(`⇢ Hashed ${hash} 🔸`)

      return filtered
    },

    //+-------------------------------------------------
    // onAPI()
    // Performs a search on the API
    // -----
    // Created on Sun Jan 05 2025
    //+-------------------------------------------------
    onAPI(source, filters) {
      console.warn('WIP')
      // // Perform a search on the API
      //   // Only allowd sources will be searched
      //   if (['all', 'palette'].includes(props.filters.source)) {
      //     // console.warn(
      //     //   'comprobar otros filtros y trabajar en optimizar el payload',
      //     //   'genre, released, sortby: name, score,released, hltb'
      //     // )
      //     $search.stats.api_start = performance.now()
      //     await $data.search({ ...props.filters })
      //     $search.stats.api_end = performance.now()
      //     emit('search:end')
      //     $search.loading = false
      //     log('⇢ search:end:api', $search.stats)
      //     return
      //   }
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
