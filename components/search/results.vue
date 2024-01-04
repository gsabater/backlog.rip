<template>
  <div class="row">
    <!-- <div class="col">
      <pre>
        {{ repository }}
      </pre>
    </div> -->
  </div>
  <div class="row row-deck row-cards">
    <template v-for="(app, i) in items" :key="'card' + i">
      <div class="col col-6 col-lg-25">
        <b-game :key="app" :appid="app"></b-game>
      </div>
    </template>
  </div>
</template>

<script>
/**
 * @file:    \components\search\results.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Thu Jan 04 2024
 **/

export default {
  name: 'SearchResults',
  components: {},

  props: {
    source: {
      type: String,
      default: 'all', // or 'library'
    },

    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      items: [],

      // repository: {
      //   timer: null,
      //   delay: 500,
      // },

      base: {
        string: '',
        ready: true,
      },

      control: {
        event: null,
        search: null,
      },

      stats: {
        total: 0,
        filtered: 0,

        time: 0,
      },

      ui: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),

    //+-------------------------------------------------
    // mergeFilters()
    // Initializes this.f
    // With values from props and presets
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    // f() {
    //   return { ...this.base, ...this.filters }
    // },
  },

  methods: {
    //+-------------------------------------------------
    // search()
    // Handles throttling of search to the API
    // And executes a filter()
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    search(source = null) {
      log('⚡ Searching from: ', source || 'direct call')

      const json = JSON.stringify(this.filters)
      const hash = btoa(json)

      if (source == 'event' && this.control.search === hash) {
        log('🛑 Search already done')
        return
      }

      this.filter()

      if (!this.filters?.string || this.filters?.string?.length < 3) return
      this.dataStore.search(hash)
    },

    //+-------------------------------------------------
    // filter()
    //
    // -----
    // Created on Thu Nov 23 2023
    //+-------------------------------------------------
    filter() {
      // log('🌈 Filtering')
      if (!this.dataStore.isReady) return

      console.time('Filter')
      const start = performance.now()

      let logged = 5
      let sorted = []
      const items = []

      // prettier-ignore
      const source = (this.source == 'all')
        ? this.dataStore.list()
        : this.dataStore.library()

      log('🌈 Filtering on ', this.source)
      log('Amount of apps #', Object.keys(source).length)
      log('Filters: ', JSON.stringify(this.filters))
      for (const uuid in source) {
        const app = source[uuid]
        // console.log(app)

        // Filter: Ignored games
        // Remove any games ignored
        //+---------------------------------------
        if (app.is?.ignored) {
          if (logged > 0) console.warn('🛑 Skipping ignored app', app.name, app)
          continue
        }

        // Filter: Name
        // Match with on app.name and steam_id
        //+---------------------------------------
        if (this.filters?.string?.length > 0) {
          let appName = app.name ? app.name : ''
          appName = appName.toString().toLowerCase()

          if (
            appName.indexOf(this.filters.string) === -1 &&
            app.steam_id.toString() !== this.filters.string
          ) {
            // counters.skip++
            // data.hidden.string.push(steam_id)

            if (logged > 0) {
              console.warn('🛑 Skipping as not name', this.filters.string, app.name)
            }
            continue
          }
        }

        // Filter: Backlog state
        // Match with on app.state
        //+---------------------------------------
        if (this.filters?.state) {
          if (app.state !== this.filters.state) {
            if (logged > 0) {
              console.warn('🛑 Skipping as not in state', this.filters.state, app.name)
            }

            continue
          }
        }

        // Finally, add the app to items
        //+---------------------------------------
        items.push(uuid)

        logged--
      }

      console.timeEnd('Filter')
      const end = performance.now()

      log(
        '🌈 Filter done (amount, first, data[first])',
        items.length,
        items[0],
        window.db?.d?.[items[0]]
      )
      this.stats.time = end - start

      log('🌈 Dropping stats', this.stats, this.filters)

      sorted = this.sort(items)
      this.items = sorted.slice(0, 30)

      this.$forceUpdate()
    },

    //+-------------------------------------------------
    // Sort()
    //
    // -----
    // Created on Thu Jan 04 2024
    //+-------------------------------------------------
    sort(items) {
      log('🌈 Sorting', this.filters.sortBy)
      // SortBy: playtime
      // Using app.playtime
      //+---------------------------------------
      if (this.filters.sortBy == 'playtime') {
        items.sort((a, b) => {
          const playtimeA = a.playtime?.steam || 0
          const playtimeB = b.playtime?.steam || 0
          return playtimeB - playtimeA
        })
      }

      return items
    },

    async loadRepositories() {
      log('Loading repositories')
      this.dataStore.init() // <- this should be some kind of event fired from the store
    },

    init() {
      this.loadRepositories
      this.search()
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('data:updated', () => {
      log('⭕ Starting a search from an event -> data:updated')
      this.control.event = 'data:updated'
      this.search('event')
    })

    this.$mitt.on('data:ready', () => {
      log('⭕ Starting a search from an event -> data:ready')
      this.control.event = 'data:ready'
      this.search('event')
    })
  },

  unmounted() {
    this.$mitt.off('data:ready')
    this.$mitt.off('data:updated')
  },
}
</script>

<style>
@media (min-width: 992px) {
  .col-lg-25 {
    flex: 0 0 auto;
    width: 20%;
  }
}

.col-25 {
  flex: 0 0 auto;
  width: 20%;
}
</style>
