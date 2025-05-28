/*
 * @file:    \stores\searchStore.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th September 2024
 * Modified: Fri 23 May 2025 - 14:10:15
 */

import apiService from '../services/apiService'
import searchService from '../services/searchService'
import filterService from '../services/filterService'

let $nuxt = null
let $data = null
let $state = null
let $repos = null

// Hashed
// Stores instances for each search executed
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// let hashed = {}

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
      box: '',
      string: '',

      source: 'all',
      sortBy: 'score',
      sortDir: 'desc',

      filters: [],
      // released: null,

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
      console.warn('deleteme ...')
      // if (!hash) hash = this.latest
      // return hashed[hash] ?? null
    },

    //+-------------------------------------------------
    // prepare()
    // Prepares a new search instance.
    // This is run when the search is mounted, and merges filters with props and URL filters
    // -----
    // In the future, this.f should be placed
    // in an keyed object for each search instance
    // -----
    // Created on Tue Nov 14 2023
    // Updated on Sun Jul 14 2024 - Use slug for special filters
    // Updated on Thu Sep 19 2024 - In library, sort by playtime
    // Updated on Fri Oct 25 2024 - Dynamically attempt to find the genre
    // Updated on Tue Jan 14 2025 - Moved to searchStore
    // Updated on Tue Apr 29 2025 - Better merge of route filters
    //+-------------------------------------------------
    async prepare(filters) {
      let f = {}
      let merged = {}

      filters = filters || {}
      const base = JSON.parse(JSON.stringify(this.base))
      f = { ...base, ...filters }

      const route = await this.routeParams(f)

      merged = {
        ...f,
        ...route.base,
        filters: route.filters,
      }

      this.f = merged
    },

    //+-------------------------------------------------
    // routeParams()
    // Extract filters from the route.
    // -----
    // Created on Tue Jan 14 2025
    //+-------------------------------------------------
    async routeParams(base) {
      const $route = useRoute()

      // Default values for library viewing
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if ($route.path.includes('library')) {
        base.source = 'library'
        base.sortBy = 'playtime'
        base.sortDir = 'desc'
      }

      // Handle query base filters
      // Those are search, sort and show
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      base.string = $route.query.search || base.string
      base.sortBy = $route.query.sortBy || base.sortBy
      base.sortDir = $route.query.sortDir || base.sortDir
      base.box = base.string

      // Handle the query params
      // Those are the params after the "?"
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let query = $route.fullPath.split('?')[1] || null
      let filters = this.handleQueryFilters(query)
      if (filters.length) base.show.tags = 'bar'

      // Handle the slug param
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let slug = $route.params?.slug || null
      let pep = await this.handleRouteSlug(slug)

      // Handle is modifier
      // "is" is a special flag to identify easily source
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // TODO: do that searching into the filters array
      // if (filters.source.includes('library') && filters.states.length == 1) {
      //   filters.is = 'state:' + filters.states[0]
      //   filters.source = filters.is
      // }

      return {
        base: base,
        filters: filters,
      }
    },

    async handleRouteSlug() {
      return 123
      if (slug && typeof slug == 'object') slug = slug[0]

      if (slug) {
        if (['pinned', 'hidden', 'favorites'].includes(slug)) {
          base.source = 'library:' + slug
          base.is = slug
          slugged = true
        }

        // Dynamically add state as a filter
        // When the slug is set and found in the states array
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (!slugged && $state.states.length) {
          const state = $state.states.find((g) => g.slug == slug)
          if (state) {
            // filters.states = [state.id]
            // TODO: Add new filter
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
          // TODO: add new filter
          // if (genre) filters.genres = [genre.id]
        }
      }
    },

    //+-------------------------------------------------
    // handleQueryFilters()
    // Extract filters from a query string
    // Query string is something like this:
    // .../library?score.gte.85
    // .../library?score.gte.90&state.in.2+5&released.after.2000-01-01
    // .../library?score.gte.90&state.in.2+5&search=elden
    // -----
    // Created on Tue Apr 29 2025
    // Updated on Tue May 13 2025 - Added string support
    //+-------------------------------------------------
    handleQueryFilters(query) {
      if (!query) return []

      let params = query.split('&')
      const arrays = Object.keys(filterService.definitions).filter(
        (key) => filterService.definitions[key].type === 'array'
      )

      const filters = params.filter((key) => {
        // Filter out empty values
        if (!key) return false

        // Filter out non-filter keys
        if (!key.includes('.')) return false

        // Filter out non-existing filters
        const [filter, mod, rawValue] = key.split('.')
        if (!filterService.definitions[filter]) return false

        // Filter out non-existing modifiers
        // if (!filterService.definitions[filter].modifiers[mod]) return false

        return true
      })

      return filters.map((key) => {
        if (key.includes('=')) {
          const [key, value] = key.split('=')
          return { filter: 'string', mod: 'contains', value }
        }

        const [filter, mod, rawValue] = key.split('.')

        // prettier-ignore
        let value = rawValue.includes('+')
          ? rawValue.split('+').map((v) => (isNaN(v) ? v : Number(v)))
          : (isNaN(rawValue) ? rawValue : Number(rawValue))

        // Turn values into supposed to be arrays
        if (arrays.includes(filter)) {
          if (!Array.isArray(value)) {
            value = [value]
          }
        }

        return { filter, mod, value }
      })
    },

    //+-------------------------------------------------
    // addFilter()
    // Adds a new filter to the array
    // -----
    // Created on Thu Apr 03 2025
    //+-------------------------------------------------
    addFilter(filter) {
      this.f.filters.push(filter)

      return this.f.filters.length - 1
    },

    //+-------------------------------------------------
    // setFilter()
    // updates the filter values
    // -----
    // Created on Thu Apr 03 2025
    //+-------------------------------------------------
    setFilter(index, mod, value) {
      this.f.filters[index].mod = mod
      this.f.filters[index].value = value
    },

    //+-------------------------------------------------
    // clearFilter()
    // Removes a filter
    // -----
    // Created on Thu Apr 03 2025
    //+-------------------------------------------------
    clearFilter(index) {
      if (index == -1) {
        this.f.box = ''
        this.f.string = ''
      } else this.f.filters.splice(index, 1)
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
    // setRouteFilters
    // Append the current filters to the URL with params
    // -----
    // Created on Wed Feb 05 2025
    //+-------------------------------------------------
    setRouteFilters(filters, hash) {
      console.warn('creo que no se usa')
      console.warn('🔸🔸🔸🔸deleteme ...')
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

      return { type, apps }
    },

    //+-------------------------------------------------
    // run()
    // Performs a search
    // -----
    // Created on Sun Jan 05 2025
    // Updated on Thu May 15 2025 - Refactored and improved filter handling
    //+-------------------------------------------------
    run(f) {
      this.loading = true

      let filters = f || this.f
      let source = this.getSource(filters)

      // Initialize the search
      // And preload some data when needed
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      filters.is = source.type
      this.prepareStats(filters, source)

      if (source.type == 'all' && !$repos.loaded.includes('popular')) {
        $repos.topGames('popular')
      }

      // Filter, sort and paginate
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let filtered = searchService.filter(source.apps, filters)
      let paginated = searchService.paginate(filtered.items, filters.show)
      let hash = filterService.makeHash(filters)

      // Search for the API
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      apiService.search(hash?.api)

      this.endSearch(filters, filtered)

      return {
        items: paginated,
      }
    },

    //+-------------------------------------------------
    // prepareStats()
    // Sets initial stats values
    // -----
    // Created on Tue May 13 2025
    //+-------------------------------------------------
    prepareStats(filters, source) {
      this.stats.start = performance.now()
      // this.stats.end = 0
      // this.stats.api_start = 0
      // this.stats.api_end = 0
      // this.stats.api = 0
      // this.stats.time = 0

      if (source.type == 'all') this.stats.apps = $nuxt.$app.count.api
      else this.stats.apps = Object.keys(source.apps).length
    },

    //+-------------------------------------------------
    // endSearch()
    // Sets stats at the end of the search
    // -----
    // Created on Tue May 13 2025
    //+-------------------------------------------------
    endSearch(filters, filtered) {
      this.stats.end = performance.now()
      this.stats.time = this.stats.end - this.stats.start

      this.stats.results = filtered.results
      this.stats.filtered = filtered.filtered || 0

      this.stats.showing = searchService.calcShowing(filters, filtered.results)
      this.stats.nextPage = searchService.calcNextPage(filters, filtered.results)

      this.loading = false
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
      console.warn('deleteme ...')
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
    // resetHashed()
    // Resets the hashed object and latest values while
    // keeping API: hashes
    // -----
    // Created on Fri Jan 17 2025
    //+-------------------------------------------------
    // resetHashed() {
    //   console.warn('deleteme ...')
    //   if (Object.keys(hashed).length === 0) return

    //   Object.keys(hashed).forEach((key) => {
    //     if (!key.includes('API:')) delete hashed[key]
    //   })

    //   this.latest = null
    // },

    setTime(time) {
      console.warn('deleteme ...')
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

      if (window) window.$search = { x: this }
    },
  },

  getters: {
    time() {
      if (this.stats.api) return this.stats.time + this.stats.api
      return this.stats.time
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
