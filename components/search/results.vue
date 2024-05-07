<template>
  <pre
    class="my-3"
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
    >{{ items.length }}
    --
    {{ filters }}
</pre
  >

  <slot name="body" :items="items">
    <div class="row row-deck row-cards row-games-list">
      <template v-for="(app, i) in items" :key="'card' + i">
        <div
          class="col col-6 col-sm-4 col-md-3 col-lg-custom pt-1 pb-3"
          style="padding-left: 0.75rem; padding-right: 0.75rem">
          <b-game :key="app" :uuid="app" :body="['name']"></b-game>
        </div>
      </template>
    </div>
  </slot>
</template>

<script>
/**
 * @file:    \components\search\results.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Sat May 04 2024
 **/

// import { useThrottleFn } from '@vueuse/core'
import { useThrottleFn } from '@vueuse/core'
import searchFn from '~/utils/search'

export default {
  name: 'SearchResults',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    source: {
      type: [String, Array],
      default: 'all', // 'library', []
    },

    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['search:start', 'search:end'],

  setup(props, { emit }) {
    const $data = useDataStore()

    const items = ref([])
    const stats = {
      amount: 0, // amount of apps as source
      results: 0, // amount of apps after filtering
      filtered: 0, // amount of apps filtered out

      time: 0, // time it took to filter and sort
    }

    //+-------------------------------------------------
    // search()
    // Generates a hash from the filters
    // And performs a search on the API or local
    // -----
    // Created on Fri Nov 24 2023
    // Updated on Tue Jan 09 2024
    // Updated on Mon Mar 25 2024 - useThrottleFn
    //+-------------------------------------------------
    const search = useThrottleFn(
      (source = null) => {
        if (props.disabled) return
        if (Object.keys(props.filters).length === 0) return

        log('✨🔥 search:start - from:', source || 'direct')

        emit('search:start', source)
        filter()
        emit('search:end')

        // Perform a search on the API
        // Only allowd sources will be searched
        const sources = ['all', 'palette']
        if (sources.includes(props.source)) {
          // console.warn(
          //   'comprobar otros filtros y trabajar en optimizar el payload',
          //   'genre, released, sortby: name, score,released, hltb'
          // )

          $data.search({ ...props.filters })
        }
      },
      500,
      true
    )

    //+-------------------------------------------------
    // filter()
    // Loads a source and filters out apps
    // Generates an index to sort afterwords
    // -----
    // Created on Thu Nov 23 2023
    // Updated on Tue Jan 09 2024 - Included utils.search
    // Updated on Thu Feb 15 2024 - Added stats
    // Updated on Mon Mar 25 2024 - On setup
    //+-------------------------------------------------
    const filter = () => {
      // do again?
      // if (!$data.isReady) return

      let source = null
      const start = performance.now()

      // prettier-ignore
      if (Array.isArray(props.source)) source = props.source
      else source = props.source == 'all' ? $data.list() : $data.library('object')

      if (source == 'all') stats.amount = this.$app.count.api
      stats.source = props.source

      log(
        `⚡ Filtering "${props.source}" with ${Object.keys(source).length} apps with filters`,
        JSON.stringify(props.filters)
      )

      stats.amount = Object.keys(source).length
      if (props.source.length == 0) return

      const searched = searchFn.filter(source, props.filters, { source: props.source })
      const paged = searchFn.paginate(searched.items, props.filters.show)
      const end = performance.now()

      items.value = paged

      stats.time = end - start
      stats.results = searched.results
      stats.filtered = searched.filtered || 0

      // this.$forceUpdate()
    }

    return { search, items, stats }
  },

  data() {
    return {
      control: {
        hash: null,
        event: null,
        search: null,
      },

      // stats: {
      //   amount: 0, // amount of apps as source
      //   results: 0, // amount of apps after filtering
      //   filtered: 0, // amount of apps filtered out

      //   time: 0, // time it took to filter and sort
      // },
    }
  },

  computed: {
    ...mapStores(useDataStore),
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
    //+-------------------------------------------------
    // search()
    // Generates a hash from the filters
    // And performs a search on the API or local
    // -----
    // Created on Fri Nov 24 2023
    // Updated on Tue Jan 09 2024
    //+-------------------------------------------------
    // _search(source = null) {
    //   log('✨🔥 Search: init from: ', source || 'direct run')

    //   if (Object.keys(this.filters).length === 0) return
    //   // this.$emit('loading', false)

    //   const control = { ...this.filters }
    //   delete control.state
    //   delete control.show

    //   const json = JSON.stringify(control)
    //   const hash = btoa(json)

    //   if (source == 'event' && this.control.search === hash) {
    //     log('🛑 Search already done')
    //     return
    //   }

    //   this.control.hash = hash
    //   this.filter()

    //   if (this.source == 'all') {
    //     if (!this.filters?.string || this.filters?.string?.length < 3) return
    //     this.dataStore.search(hash)
    //     // this.$emit('loading', true)
    //   }
    // },

    //+-------------------------------------------------
    // filter()
    // Loads a source and filters out apps
    // Generates an index to sort afterwords
    // -----
    // Created on Thu Nov 23 2023
    // Updated on Tue Jan 09 2024 - Included utils.search
    // Created on Thu Feb 15 2024 - Added stats
    //+-------------------------------------------------
    // _filter() {
    //   // do again?
    //   // if (!this.dataStore.isReady) return

    //   let source = null
    //   const start = performance.now()

    //   // prettier-ignore
    //   if (Array.isArray(this.source)) source = this.source
    //   else source = this.source == 'all' ? this.dataStore.list() : this.dataStore.library('object')

    //   if (source == 'all') this.stats.amount = this.$app.count.api
    //   this.stats.source = this.source

    //   log(
    //     `⚡ Filtering ${this.source} with ${Object.keys(source).length} apps with filters`,
    //     JSON.stringify(this.filters)
    //   )

    //   this.stats.amount = Object.keys(source).length
    //   if (this.source.length == 0) return

    //   const searched = search.filter(source, this.filters, { source: this.source })
    //   const paged = search.paginate(searched.items, this.filters.show)
    //   const end = performance.now()

    //   this.items = paged

    //   this.stats.time = end - start
    //   this.stats.results = searched.results
    //   this.stats.filtered = searched.filtered || 0

    //   this.$forceUpdate()
    // },

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
    this.init()

    this.$mitt.on('data:updated', () => {
      if (!$app.ready) return

      if (this.$app.dev) log('✨ Search from event', 'data:updated')
      this.search('event')
    })

    // window.$results = this
  },

  beforeUnmount() {
    this.$mitt.off('data:updated')
  },
}
</script>
