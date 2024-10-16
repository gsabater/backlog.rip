<template>
  <slot name="body" :items="items">
    <!-- <div class="page-header">
        <div class="row align-items-center">
          <div class="col-auto">
            <span class="avatar avatar-md">90</span>
          </div>
          <div class="col">
            <h2 class="page-title">Group name</h2>
            <div class="page-subtitle">
              <div class="row">
                <div class="col-auto">
                  <small class="text-reset">Value 1</small>
                </div>
                <div class="col-auto">
                  <small class="text-reset">value 2</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto d-none d-md-flex">
            <a href="javascript:void(0)" class="btn btn-primary">
              <Icon>ArrowUp</Icon>
              Back to top
            </a>
          </div>
        </div>
      </div> -->

    <div v-if="items.length || loading" class="row row-deck row-cards row-games-list">
      <template v-for="(app, i) in items" :key="'card' + i">
        <div
          class="col col-6 col-sm-4 col-md-3 col-lg-custom pt-1 pb-3"
          style="padding-left: 0.75rem; padding-right: 0.75rem">
          <b-game :key="app" :uuid="app" :body="cardBody" tracking></b-game>
        </div>
      </template>

      <div
        v-if="loading"
        class="col col-6 col-sm-4 col-md-3 col-lg-custom pt-1 pb-3"
        style="padding-left: 0.75rem; padding-right: 0.75rem">
        <div class="card-game" style="">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #a1c6cb0f;
              padding: 20px;
              border: 1px dashed #777777;
              z-index: 23333;
              width: 100%;
              position: relative;
              cursor: pointer;
              border-radius: 2px;
              aspect-ratio: 27 / 40;
              flex-direction: column;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
            ">
            <h2>Loading</h2>
            <v-progress-linear
              color="deep-purple-accent-4"
              height="6"
              indeterminate
              rounded></v-progress-linear>
          </div>
        </div>
      </div>
    </div>
  </slot>
</template>

<script>
/**
 * @file:    \components\search\results.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Wed 16 October 2024 - 14:30:55
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

    filters: {
      type: Object,
      default: () => ({}),
    },

    // Not used yet, left for reference
    // source: {
    //   type: [String, Array],
    //   default: 'all', // 'library', []
    // },
  },

  emits: ['search:ready', 'search:start', 'search:end'],

  setup(props, { emit }) {
    const $nuxt = useNuxtApp()
    const $data = useDataStore()
    const $search = useSearchStore()

    const items = ref([])

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
      async (source = null) => {
        if (props.disabled) return
        if (Object.keys(props.filters).length === 0) return

        $search.loading = true
        emit('search:start', source)
        log('🪡 search:start', source || 'direct')

        filter()

        log('⇢ search:app', $search.stats)

        // Perform a search on the API
        // Only allowd sources will be searched
        const sources = ['all', 'palette']
        if (sources.includes(props.filters.source)) {
          // console.warn(
          //   'comprobar otros filtros y trabajar en optimizar el payload',
          //   'genre, released, sortby: name, score,released, hltb'
          // )

          $search.stats.api_start = performance.now()
          await $data.search({ ...props.filters })
          $search.stats.api_end = performance.now()

          emit('search:end')
          $search.loading = false
          log('⇢ search:end:api', $search.stats)
        } else {
          emit('search:end')
          $search.loading = false
          log('⇢ search:end:app', $search.stats)
        }
      },
      1000,
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

      // $search.stats.start = performance.now()
      const source = getSource()
      // stats.source = props.filters.source

      // Stop execution if there is nothing to filter
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (
      //   props.filters.source == 'library' &&
      //   history.amount == 0 &&
      //   Object.keys(source).length == 0
      // ) {
      //   log('🔥 Canceling the search because of empty library ... no really, needs work')
      //   // return
      // }

      log(`⇢ Filtering "${props.filters.source}" (${Object.keys(source).length} apps)`)
      log('⇢ Filters applied', JSON.stringify(props.filters))

      $search.stats.apps = Object.keys(source).length
      if (props.filters.source == 'all') $search.stats.apps = $nuxt.$app.count.api
      if (props.filters.source.length == 0) return

      const searched = searchFn.filter(source, props.filters, { source: props.source })
      const paged = searchFn.paginate(searched.items, props.filters.show)

      items.value = paged

      // $search.stats.time = end - start
      $search.stats.end = performance.now()
      $search.stats.results = searched.results
      $search.stats.filtered = searched.filtered || 0

      $search.history.items = searched.items
      // debugger
      // this.$forceUpdate()
    }

    //+-------------------------------------------------
    // getSource()
    // Returns the source array based on the props
    // -----
    // Created on Wed Jul 24 2024
    //+-------------------------------------------------
    const getSource = () => {
      // Source is an array of fixed items
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (Array.isArray(props.source)) return props.source

      // Source is all games
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (props.filters.source == 'all') return $data.list()

      // The source is the library but...
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!props.filters.is) return $data.library('object')
      if (props.filters.is == 'pinned') return $data.pinned('object')
      if (props.filters.is == 'hidden') return $data.hidden('object')
      if (props.filters.is == 'favorites') return $data.library('object')
    }

    return { search, items, loading: $search.loading }
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
    //   log('🪡🔥 Search: init from: ', source || 'direct run')

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
      this.$emit('search:ready')
    },
  },

  computed: {
    cardBody() {
      console.warn('🔴 cardBody', this.filters.show.card)
      return []
      let show = [...this.filters.show.card]

      if (show.length == 1 && show.includes('default')) {
        if (this.filters.sortBy == 'score') {
          show.push('score')
        }

        if (this.filters.sortBy == 'released') {
          show.push('released')
        }

        if (this.filters.sortBy == 'playtime') {
          show.push('playtime')
        }

        if (this.filters.sortBy == 'hltb') {
          show.push('hltb')
        }
      }

      return show
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('data:updated', () => {
      if (!$app.ready) return
      this.search('data:updated')
    })

    // this.$mitt.on('data:deleted', () => {
    //   if (!$app.ready) return
    //   if (this.$app.dev) log('🪡 Search from event', 'data:deleted')
    //   this.search('data:deleted')
    // })
  },

  beforeUnmount() {
    this.$mitt.off('data:updated')
    this.$mitt.off('data:deleted')
  },
}
</script>
