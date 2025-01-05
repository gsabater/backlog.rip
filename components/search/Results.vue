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
            :visible="visibleProps"
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
            <b-game :key="app" :uuid="app" :visible="visibleProps" tracking></b-game>
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
 * Modified: Sun 05 January 2025 - 18:13:02
 **/

import { useThrottleFn } from '@vueuse/core'
// import searchFn from '~/utils/search'

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
    // const $nuxt = useNuxtApp()
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
    // Created on Sun Jan 05 2025 - Filter in the store
    //+-------------------------------------------------
    const search = useThrottleFn(
      async (source = null) => {
        if (props.disabled) return
        if (Object.keys(props.filters).length === 0) return

        // log('🪡 search:start', source || 'direct')
        emit('search:start', source)

        const pep = $search.run(props.filters)
        items.value = pep.items

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
    ...mapStores(useDataStore, useSearchStore),

    //+-------------------------------------------------
    // visibleProps()
    // VisibleProps fields defined by the user
    // -----
    // Created on Tue Dec 31 2024
    //+-------------------------------------------------
    visibleProps() {
      return this.searchStore.visibleProps(this.filters)
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
