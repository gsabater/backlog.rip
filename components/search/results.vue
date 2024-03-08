<template>
  <pre
    class="d-none my-3"
    style="
      position: fixed;
      bottom: 10px;
      left: 400px;
      z-index: 9999;
      max-height: 120vh;
      overflow-y: scroll;
      background: rgba(13, 12, 42, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      width: auto;
    "
    >{{ filters }}
</pre
  >
  <div class="row row-deck row-cards row-games-list">
    <template v-for="(app, i) in items" :key="'card' + i">
      <div
        class="col col-6 col-sm-4 col-md-3 col-lg-custom pt-1 pb-3"
        style="padding-left: 0.75rem; padding-right: 0.75rem">
        <b-game :key="app" :uuid="app" :body="['name']"></b-game>
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
 * Modified: Wed Mar 06 2024
 **/

// import { useThrottleFn } from '@vueuse/core'

export default {
  name: 'SearchResults',

  props: {
    source: {
      type: [String, Array],
      default: 'all', // 'library', []
    },

    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['loading'],

  data() {
    return {
      items: [],

      control: {
        hash: null,
        event: null,
        search: null,
      },

      stats: {
        amount: 0, // amount of apps as source
        results: 0, // amount of apps after filtering
        filtered: 0, // amount of apps filtered out

        time: 0, // time it took to filter and sort
      },
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

  watch: {
    // filters: {
    //   handler() {
    //     log('💎 Search: Watcher', JSON.stringify(this.filters))
    //     this.search('watch')
    //   },
    //   deep: true,
    // },
  },

  methods: {
    _search() {
      console.warn(1)
      debounce(this.search, 1000)
    },

    //+-------------------------------------------------
    // search()
    // Generates a hash from the filters
    // And performs a search on the API or local
    // -----
    // Created on Fri Nov 24 2023
    // Updated on Tue Jan 09 2024
    //+-------------------------------------------------
    search(source = null) {
      log('✨🔥 Search: init from: ', source || 'direct run')

      if (Object.keys(this.filters).length === 0) return
      // this.$emit('loading', false)

      const control = { ...this.filters }
      delete control.state
      delete control.show

      const json = JSON.stringify(control)
      const hash = btoa(json)

      if (source == 'event' && this.control.search === hash) {
        log('🛑 Search already done')
        return
      }

      this.control.hash = hash
      this.filter()

      if (this.source == 'all') {
        if (!this.filters?.string || this.filters?.string?.length < 3) return
        this.dataStore.search(hash)
        // this.$emit('loading', true)
      }
    },

    //+-------------------------------------------------
    // filter()
    // Loads a source and filters out apps
    // Generates an index to sort afterwords
    // -----
    // Created on Thu Nov 23 2023
    // Updated on Tue Jan 09 2024 - Included utils.search
    // Created on Thu Feb 15 2024 - Added stats
    //+-------------------------------------------------
    filter() {
      // do again?
      // if (!this.dataStore.isReady) return

      let source = null
      const start = performance.now()

      // prettier-ignore
      if (Array.isArray(this.source)) source = this.source
      else source = this.source == 'all' ? this.dataStore.list() : this.dataStore.library('object')
      this.stats.source = this.source

      log('⚡ Search: Filter on ', this.source)
      log('⚡ Search: Amount of apps #', Object.keys(source).length)
      this.stats.amount = Object.keys(source).length

      if (this.source.length == 0) return

      log('⚡ Search: Filters: ', JSON.stringify(this.filters))

      const searched = search.filter(source, this.filters, { source: this.source })
      const paged = search.paginate(searched.items, this.filters.show)
      const end = performance.now()

      this.items = paged

      this.stats.time = end - start
      this.stats.results = searched.results
      this.stats.filtered = searched.filtered || 0

      this.$forceUpdate()
    },

    // async loadRepositories() {
    //   log('Loading repositories')
    //   this.dataStore.init() // <- this should be some kind of event fired from the store
    // },

    init() {
      // this.loadRepositories()
      // this.search('onmounted')
    },
  },

  mounted() {
    window.$results = this
    this.init()
  },
}
</script>
