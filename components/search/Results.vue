<template>
  <slot name="body" :items="items" v-bind="$attrs">
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

    <!--#
      *+---------------------------------
      *| List grid
      *| scaffolding to use with b-game type list
      *+--------------------------------- -->
    <template v-if="layout == 'list'">
      <div v-if="items.length || loading" class="card mb-3">
        <div class="list-group card-list-group games-group games--list">
          <!-- <template :key="app"> -->
          <b-game
            v-for="(app, i) in items"
            :key="app"
            type="list"
            :uuid="app"
            :body="cardBody"
            :display="['name', 'score', 'released']"
            style="padding-top: 0.65rem; padding-bottom: 0.65rem">
            <template #game:prepend>
              <div class="col col-auto text-center px-1" style="min-width: 33px">
                <div
                  class="font-serif"
                  style=""
                  :class="{
                    'list-gold': i == 0,
                    'list-silver': i == 1,
                    'list-bronze': i == 2,
                    'text-muted': i > 2,
                  }">
                  {{ i + 1 }}
                </div>
              </div>
            </template>
          </b-game>

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
      </div>
    </template>

    <!--#
      *+---------------------------------
      *| Grid layout
      *| bootstrap grid
      *+--------------------------------- -->
    <template v-if="layout == 'grid'">
      <div
        v-if="items.length || loading"
        class="row row-deck row-cards row-games-list"
        v-bind="$attrs">
        <template v-for="(app, i) in items" :key="'card' + app">
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
    </template>
  </slot>
</template>

<script>
/**
 * @file:    \components\search\results.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Thu 12 December 2024 - 16:51:47
 **/

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
      default: () => ({ string: '' }),
    },

    source: {
      type: [Array],
      default: () => [],
    },

    // Not used yet, left for reference
    // source: {
    //   type: [String, Array],
    //   default: 'all', // 'library', []
    // },

    layout: {
      type: String,
      default: 'grid',
      options: ['grid', 'list'],
    },
  },

  emits: ['search:ready', 'search:start', 'search:end'],

  setup(props, { emit }) {
    const $nuxt = useNuxtApp()
    const $data = useDataStore()
    const $search = useSearchStore()

    const items = ref([])
    let typeofSource = null

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

        // Perform a search on the API
        // Only allowd sources will be searched
        if (['all', 'palette'].includes(props.filters.source)) {
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

          return
        }

        emit('search:end')
        $search.loading = false
        log('⇢ search:end', $search.stats)
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
      const source = getSource()

      log(
        `⇢ Searching [${typeofSource}] (${Object.keys(source).length}) 🔸`,
        JSON.stringify(props.filters)
      )

      $search.stats.apps = Object.keys(source).length
      if (typeofSource == 'all') $search.stats.apps = $nuxt.$app.count.api
      // if (props.filters.source.length == 0) return -> ??

      $search.stats.start = performance.now()
      const searched = searchFn.filter(source, props.filters, { source: props.source })
      items.value = searchFn.paginate(searched.items, props.filters.show)

      // $search.stats.time = end - start
      $search.stats.end = performance.now()
      $search.stats.results = searched.results
      $search.stats.filtered = searched.filtered || 0

      $search.history.items = searched.items
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
      typeofSource = 'array'
      if (Array.isArray(props.source) && props.source.length) return props.source

      // Source is all games
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      typeofSource = 'all'
      if (props.filters.source == 'all') return $data.list()

      // The source is the library but...
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      typeofSource = props.filters.is ?? 'library'
      if (!props.filters.is) return $data.library('object')
      if (props.filters.is == 'pinned') return $data.pinned('object')
      if (props.filters.is == 'hidden') return $data.hidden('object')
      if (props.filters.is == 'favorites') return $data.library('object')
    }

    return { search, items, loading: $search.loading }
  },

  data() {
    return {
      // control: {
      //   hash: null,
      //   event: null,
      //   search: null,
      // },
    }
  },

  computed: {
    ...mapStores(useDataStore),
  },

  computed: {
    cardBody() {
      // // console.warn('🔴 cardBody', this.filters.show.card)
      // return []
      const show = [...(this.filters?.show?.card ?? [])]

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

  watch: {
    // filters: {
    //   handler() {
    //     log('💎 Search: Watcher', JSON.stringify(this.filters))
    //     this.search('watch:filters')
    //   },
    //   deep: true,
    // },

    source: {
      handler() {
        if (!this.source.length) return
        this.search('watch:source')
      },
      deep: true,
    },
  },

  methods: {
    init() {
      // this.loadRepositories()
      this.$emit('search:ready')

      if (!this.source.length) return
      this.search('init:array')
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
    // this.$mitt.off('data:deleted')
  },
}
</script>
