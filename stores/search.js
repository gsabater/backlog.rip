/*
 * @file:    \stores\searchStore.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th September 2024
 * Modified: Wed 02 April 2025 - 17:40:51
 */

import searchService from '../services/searchService'
import filterService from '../services/filterService'

let $nuxt = null
let $data = null
let $state = null
let $repos = null

// Hashed
// Stores instances for each search executed
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let hashed = {}

export const useSearchStore = defineStore('search', {
  state: () => ({
    f: {},
    ready: false,
    loading: false,

    // Latest
    // Hash used to identify the last search
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    latest: null,

    // base
    // Base filters template
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    base: {
      string: '',
      source: 'all',

      sortBy: 'score',
      sortDir: 'desc',

      filters: [],
      states: [],
      genres: [],
      released: null,

      mods: {
        // states: 'any(of) // all(of) // not(of)'
      },

      show: {
        page: 1,
        perPage: 42,

        tags: 'inline',
        layout: 'grid',
        card: ['default'],
      },
    },

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
  }),

  actions: {
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
    // prepare()
    // Prepares a new instance of filters and results
    // -----
    // Created on Tue Nov 14 2023
    // Updated on Sun Jan 28 2024 - Added slug param
    // Updated on Sun Jul 14 2024 - Use slug for special filters
    // Updated on Thu Sep 19 2024 - In library, sort by playtime
    // Updated on Fri Oct 25 2024 - Dynamically attempt to find the genre
    // Created on Tue Jan 14 2025 - Moved to searchStore
    //+-------------------------------------------------
    async prepare(filters) {
      let base = JSON.parse(JSON.stringify(this.base))
      let prepared = {
        ...base,
        ...filters,
      }

      // this.f.source = this.getSource()
      prepared = await this.mergeFilters(prepared)

      this.f = prepared
    },

    //+-------------------------------------------------
    // mergeFilters()
    //
    // -----
    // Created on Tue Jan 14 2025
    //+-------------------------------------------------
    async mergeFilters(filters) {
      let $route = useRoute()

      let slug = null
      let slugged = false

      //Handle base sort options for library
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if ($route.path.includes('library')) {
        filters.source = 'library'
        filters.sortBy = 'playtime'
        filters.sortDir = 'desc'
      }

      // Handle slug for special library filters
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      slug = $route.params?.slug || null

      if (slug && typeof slug == 'object') slug = slug[0]

      if (slug) {
        if (['pinned', 'hidden', 'favorites'].includes(slug)) {
          filters.source = 'library:' + slug
          filters.is = slug
          slugged = true
        }

        // Dynamically add state as a filter
        // When the slug is set and found in the states array
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (!slugged && $state.states.length) {
          const state = $state.states.find((g) => g.slug == slug)
          if (state) {
            filters.states = [state.id]
            slugged = true
          }
        }

        // Dynamically add genre as a filter
        // When the slug is set and found in the genres array
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (!slugged) {
          let genres = null

          genres = await $repos.getGenres()
          // if (!$repos.genres.length) genres = await $repos.getGenres()
          // else genres = $repos.genres

          const genre = genres.find((g) => g.slug == slug)
          if (genre) filters.genres = [genre.id]
        }
      }

      // Handle is modifier
      // "is" is a special flag to identify easily source
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters.source.includes('library') && filters.states.length == 1) {
        filters.is = 'state:' + filters.states[0]
        filters.source = filters.is
      }

      return filters
    },

    addFilter(filter) {
      this.f.filters.push(filter)
      // this.run()

      return this.f.filters.length - 1
    },

    setFilter(index, mod, value) {
      this.f.filters[index].mod = mod
      this.f.filters[index].value = value
      // this.run()
    },

    clearFilter(index) {
      this.f.filters.splice(index, 1)
      // this.run()
      // this.$emit('search:filters', this.f)
    },

    // handleRouteChanges(filters) {
    //   let $route = useRoute()
    //   const $router = useRouter()

    //   if (!filters.is && filters.source == 'all' && $route.path.includes('library')) {
    //     // $router.replace('/games')
    //     window.history.replaceState(null, '', '/games')
    //   }
    // },

    //+-------------------------------------------------
    // handleRouteFilters
    // Append the current filters to the URL with params
    // -----
    // Created on Wed Feb 05 2025
    //+-------------------------------------------------
    handleRouteFilters(filters, hash) {
      if (!$nuxt.$app.wip) return

      // TODO: this should be this.inRoute or ENUM
      const blacklist = ['source', 'is', 'mods', 'show']

      // Default filter values to compare against
      const defaultFilters = {
        string: '',
        sortBy: 'score',
        sortDir: 'desc',
      }

      // Build query params for non-default, whitelisted filters
      const queryParams = Object.entries(filters)
        .filter(([key, value]) => {
          return (
            value &&
            value !== '' &&
            value.length != 0 &&
            !blacklist.includes(key) &&
            value !== defaultFilters[key]
          )
        })
        .map(([key, value]) => {
          if (key == 'string') key = 'search'
          let encoded = encodeURIComponent(value)
          encoded = encoded.replace(/%2C/g, '+')
          return `${key}=${encoded}`
        })
        .join('&')

      // Update URL without adding to history
      const newUrl = queryParams
        ? `${window.location.pathname}?${queryParams}`
        : window.location.pathname

      window.history.replaceState({}, '', newUrl)
    },

    // replaceRoute(path) {
    //   if (this.$route.path !== path) {

    //     this.$router.replace(path, () => {});
    //   }
    // }

    //+-------------------------------------------------
    // getSource()
    // Returns the source to use in the search
    // -----
    // Created on Wed Jul 24 2024
    // Updated on Mon Jan 13 2025 - Handle source:params
    //+-------------------------------------------------
    getSource(filters) {
      // Source is an array of fixed items
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (Array.isArray(filters.source)) {
        if (filters.source.length) return { type: 'array', apps: filters.source }
        else return { type: 'array', apps: [] }
      }

      // Source is all games
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters.source == 'all') return { type: 'all', apps: $data.list() }

      // The source is the library but...
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // let type = filters.is ?? 'library'
      let type = 'library'
      let apps = null

      if (
        !filters?.source ||
        filters.source == 'library' ||
        filters.source.includes('state:')
      ) {
        return { type: 'library', apps: $data.library() }
      }

      if (filters.source.includes(':pinned')) {
        return { type: 'pinned', apps: $data.list() }
      }

      // TODO: this could be a pre-filter in $data
      // that can potentially be better than filtering in the service the whole lib
      if (filters.source.includes(':hidden')) {
        return { type: 'hidden', apps: $data.library() }
      }

      if (filters.source.includes(':favorites')) {
        return { type: 'favorites', apps: $data.library() }
      }

      // if (!filters.is) apps = $data.library('object')
      // if (filters.is == 'pinned') apps = $data.pinned('object')
      // if (filters.is == 'hidden') apps = $data.hidden('object')
      // if (filters.is == 'favorites') apps = $data.library('object')

      return { type, apps }
    },

    //+-------------------------------------------------
    // run()
    // Performs a search
    // -----
    // Created on Sun Jan 05 2025
    //+-------------------------------------------------
    run(f) {
      this.loading = true
      console.warn('🚀 run')
      // let filters = this.loadFilters(f)
      let filters = f || this.f
      let source = this.getSource(filters)
      let hash = searchService.makeHash(source, filters)

      filters.is = source.type

      let filtered = null
      let paginated = null

      if (hash) {
        log('search', `Searching ${source.type}`, hash)
        // log('search', '·· ⇢ filters', JSON.stringify(filters))
      }

      this.stats.start = performance.now()
      if (source.type == 'all') this.stats.apps = $nuxt.$app.count.api
      else this.stats.apps = Object.keys(source.apps).length

      if (source.type == 'all' && !$repos.loaded.includes('popular')) {
        $repos.topGames('popular')
      }

      this.searchAPI(source, filters)
      filtered = this.filter(hash, source, filters)
      paginated = searchService.paginate(filtered.items, filters.show)

      this.stats.end = performance.now()
      this.stats.time = this.stats.end - this.stats.start
      this.stats.results = filtered.results
      this.stats.filtered = filtered.filtered || 0

      this.stats.showing = searchService.calcShowing(filters, filtered.results)
      this.stats.nextPage = searchService.calcNextPage(filters, filtered.results)

      this.loading = false

      log('search:end', {
        apps: paginated.length,
        source: source.type,
        filters: this.f,
        stats: this.stats,
      })

      filterService.setRoute(filters)
      // this.handleRouteChanges(filters)
      // this.handleRouteFilters(filters, hash)

      return {
        hash,
        items: paginated,
      }
    },

    //+-------------------------------------------------
    // filter()
    // Filters and sorts an array of elements using the service
    // Then stores the operation with a hash.
    // IF the hash exists, return it
    // -----
    // Created on Sun Jan 05 2025
    // Created on Sun Mar 30 2025 - Disable hashes
    //+-------------------------------------------------
    filter(hash, source, filters) {
      if (!hash) return searchService.filter(source.apps, filters)

      this.latest = hash
      if (hashed[hash]) {
        // log('search', `· ⇢  Hash used`, hash)
        // return hashed[hash]
      }

      let filtered = searchService.filter(source.apps, filters)
      hashed[hash] = filtered
      // log('search', `· ⇢  Hash cached ✅`, hash)

      return filtered
    },

    //+-------------------------------------------------
    // searchAPI()
    // Performs a search on the API
    // -----
    // Created on Sun Jan 05 2025
    //+-------------------------------------------------
    async searchAPI(source, filters) {
      if (source.type !== 'all') return

      this.stats.api_start = performance.now()
      await this.callAPI({ ...filters })
      // if (!api) return

      // this.stats.api_end = performance.now()
      // wip emit('search:end')
      // this.loading = false
      // log('search', '⇢ search:end:api', this.stats)
    },

    //+-------------------------------------------------
    // callAPI()
    // Calls the api and stores the results
    // -----
    // Created on Tue Jan 14 2025
    //+-------------------------------------------------
    async callAPI(filters) {
      let hasher = searchService.makeApiHash(filters)
      if (!hasher) {
        log('search', '🛑 Skipping search on API')
        return false
      }

      let { hash, slug, json } = hasher

      if (hashed[hash]) {
        log('search', '🛑 Skipping search, already done')
        return false
      }

      hashed[hash] = true
      log('search', `· ⇢ Searching API`, hash)
      log('search', '·· ⇢ API Filters', JSON.stringify(filters))

      const xhr = await $nuxt.$axios.get(`search/${slug}.json`)
      if (xhr.status) {
        log('search', '🪂 Data from API', xhr.data)
        await $data.process(xhr.data, 'api')
      }

      return true
    },

    //+-------------------------------------------------
    // resetHashed()
    // Resets the hashed object and latest values while
    // keeping API: hashes
    // -----
    // Created on Fri Jan 17 2025
    //+-------------------------------------------------
    resetHashed() {
      if (Object.keys(hashed).length === 0) return

      Object.keys(hashed).forEach((key) => {
        if (!key.includes('API:')) delete hashed[key]
      })

      this.latest = null
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
    async init() {
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()
      $state ??= useStateStore()
      $repos ??= useRepositoryStore()

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
