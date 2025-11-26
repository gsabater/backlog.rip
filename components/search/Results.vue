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

    <!--
      *+---------------------------------
      *| List layout
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
        <template v-for="(app, i) in items" :key="`card-${i}-${app}`">
          <div
            class="col col-6 col-sm-4 col-md-3 col-lg-custom pt-1 pb-3"
            style="padding-left: 0.75rem; padding-right: 0.75rem">
            <b-game
              :key="`game-card-${i}-${app}`"
              :uuid="app"
              :visible="visibleProps"
              tracking></b-game>
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
 * Modified: 3rd November 2025 - 05:09:32
 **/

import { useThrottleFn } from '@vueuse/core'

export default {
  name: 'SearchResults',

  inject: {
    $source: {
      from: '$source',
      default: null,
    },

    $filters: {
      from: '$filters',
      default: () => ({}),
    },
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    // Not used anymore
    // filters: {
    //   type: Object,
    //   default: null,
    // },

    // Source array
    // Used for constrained searches
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    source: {
      type: [String, Array],
      default: null, // 'library', []
    },

    layout: {
      type: String,
      default: 'grid',
      options: ['grid', 'list'],
    },
  },

  emits: ['search:ready', 'search:start', 'search:end'],

  setup(props, { emit }) {
    const $nuxt = useNuxtApp()
    const $search = useSearchStore()

    // const $data = useDataStore()
    // const $route = useRoute()

    // const ready = false
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
      async (trigger = null) => {
        if (!$app.ready) return
        if (props.disabled) return

        // Conserve the trigger
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        $search.f.trigger = trigger
        if (trigger !== 'pagination') {
          $search.f.show.page = 1
        }

        const search = $search.run()
        items.value = search.items

        $nuxt.$log(`[ search:end ] ${dates.microTime($search.stats.time)} @${$search.f.trigger}`, {
          string: $search.f.string,
          trigger: $search.f.trigger,
          source: $search.f.is,
          apps: search.items.length,

          stats: $search.stats,
          filters: $search.f,
        })

        emit('search:end')
        // console.groupEnd()
      },
      700,
      true
    )

    // Watcher
    // Trigger to fire a search
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // watch(
    //   () => $search.f,
    //   (value, old) => {
    //     // if (props.disabled) return
    //     console.warn('💢💢💢💥💥💥', value)
    //     // search('filters:updated')
    //   },
    //   { deep: true }
    // )

    // Watcher
    // Trigger a search on text input change
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    watch(
      () => $search.f.string,
      (value, old) => {
        // if (props.disabled) return
        if (!old) return
        search('filters:updated')
      }
    )

    return { search, items }
  },

  data() {
    return {}
  },

  computed: {
    ...mapStores(useDataStore, useSearchStore),
    ...mapState(useSearchStore, ['f', 'loading']),

    //+-------------------------------------------------
    // visibleProps()
    // VisibleProps fields defined by the user
    // -----
    // Created on Tue Dec 31 2024
    //+-------------------------------------------------
    visibleProps() {
      return searchService.visibleProps(this.searchStore.f)
    },
  },

  watch: {
    '$app.ready': function () {
      // console.warn('watch $app.ready')
      this.init()
    },

    // 'f.source': {
    //   handler(value, old) {
    //     if (!old) return
    //     // if (!this.source.length) return
    //     // this.search('watch:source')
    //   },
    //   deep: true,
    // },
  },

  methods: {
    async init() {
      if (!this.$app.ready) return

      let filters = null

      // Apply a source if provided
      // The source can be set to the parent as well
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let providedSource = this.source || this.$source
      if (Array.isArray(providedSource)) {
        filters = {
          source: providedSource,
        }
      }

      // Set filters from props
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.$filters && typeof this.$filters == 'object') {
        filters = {
          ...filters,
          ...this.$filters,
        }
      }

      await this.searchStore.prepare(filters)
      this.$emit('search:ready')

      // Initial search
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.search('init')

      // @search:run
      // Perform a search
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.$mitt.on('search:run', () => {
        this.search('event:run')
      })

      // @data:added
      // Reset the search hashed cache
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.$mitt.on('data:added', () => {
        this.search('data:added')
      })
    },
  },

  mounted() {
    this.init()

    // this.$mitt.on('data:deleted', () => {
    //   if (!$app.ready) return
    //   if (this.$app.dev) log('🪡 Search from event', 'data:deleted')
    //   this.search('data:deleted')
    // })
  },

  beforeUnmount() {
    this.$mitt.off('search:run')
    this.$mitt.off('data:added')
    // this.$mitt.off('data:deleted')
  },
}
</script>
