<template>
  <div class="row row-deck row-cards row-games-list">
    <template v-for="(app, i) in items" :key="'card' + i">
      <div class="col col-6 col-sm-4 col-md-3 col-lg-custom">
        <b-game :key="app" :uuid="app"></b-game>
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
 * Modified: Thu Feb 01 2024
 **/

export default {
  name: 'SearchResults',

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

  emits: ['loading'],

  data() {
    return {
      items: [],

      // base: {
      //   string: '',
      //   ready: true,
      // },

      control: {
        hash: null,
        event: null,
        search: null,
      },

      // stats: {
      //   total: 0,
      //   filtered: 0,

      //   time: 0,
      // },

      // ui: {},
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
    filters: {
      handler() {
        log('💎 Search: Watcher', JSON.stringify(this.filters))
        this.search('watch')
      },
      deep: true,
    },
  },

  methods: {
    //+-------------------------------------------------
    // search()
    // Generates a hash from the filters
    // And performs a search on the API or local
    // -----
    // Created on Fri Nov 24 2023
    // Updated on Tue Jan 09 2024
    //+-------------------------------------------------
    search(source = null) {
      log('💎 Search: init from: ', source || 'direct run')

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
    //+-------------------------------------------------
    filter() {
      if (!this.dataStore.isReady) return

      // prettier-ignore
      const source = (this.source == 'all')
        ? this.dataStore.list()
        : this.dataStore.library()

      log('⚡ Search: Filter on ', this.source)
      log('⚡ Search: Amount of apps #', Object.keys(source).length)
      log('⚡ Search: Filters: ', JSON.stringify(this.filters))

      const items = search.filter(source, this.filters, { source: this.source })
      const paged = search.paginate(items, this.filters.show)

      // this.items = sorted.slice(0, this.filters)
      this.items = paged

      this.$forceUpdate()
      return

      this.$forceUpdate()
    },

    async loadRepositories() {
      log('Loading repositories')
      this.dataStore.init() // <- this should be some kind of event fired from the store
    },

    init() {
      // this.loadRepositories()
      // this.search('onmounted')
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('data:updated', () => {
      log('💎 Search: event -> data:updated')
      this.control.event = 'data:updated'
      this.search('event')
      // this.$emit('loading', false)
    })

    this.$mitt.on('data:ready', () => {
      log('💎 Search: event -> data:ready')
      this.control.event = 'data:ready'
      this.search('event')
    })
  },

  beforeUnmount() {
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

  .col-lg-custom {
    flex: 0 0 auto;
    width: 14.285%;
    /* width: 12.5%; 7 columns */
    /* width: 12.5%; 8 columns */
  }
}

.col-25 {
  flex: 0 0 auto;
  width: 20%;
}
</style>
