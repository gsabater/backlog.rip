<template>
  <div class="row">
    <div class="col-12">
      <pre
        class="my-3"
        style="
          position: fixed;
          bottom: 10px;
          left: 10px;
          z-index: 9999;
          max-height: 120vh;
          overflow-y: scroll;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 10px;
          border-radius: 5px;
          width: auto;
        "
        >{{ f }}
--
{{ stats }}
</pre
      >
    </div>
    <search-filters :filters="f" @update="onUpdate"></search-filters>

    <div class="col-12">
      <search-results ref="results" :filters="f" :source="source"></search-results>

      <template v-if="stats.amount == 0 && source == 'library'">
        <!-- <b-empty preset='empty-library'></b-empty> -->
        <div class="empty" style="border: 1px dashed #cccccc73; border-radius: 4px">
          <p class="empty-title">Your library is empty</p>
          <p class="empty-subtitle text-secondary">
            You don't have any games in your library.
            <br />
            Try importing your Steam games or add any game you want from games page.
          </p>
          <div class="empty-action">
            <b-btn to="import/steam" color="primary" size="sm" class="me-3">
              <!-- <Icon>StepInto</Icon> -->
              Import your library
            </b-btn>

            <b-btn to="games" variant="ghost" size="sm" color="secondary">
              Browse games
            </b-btn>
          </div>
        </div>
      </template>

      <div
        v-if="f && f.show && f.show.perPage && stats.amount > 0"
        class="d-flex mt-4"
        style="flex-direction: column; align-items: center">
        <div v-if="stats.results > f.show.perPage" class="btn w-75 mb-3" @click="addPage">
          Show more
        </div>
        <p class="text-muted text-center w-50">
          <!-- <hr class="my-2" > -->
          <template v-if="stats.results > 0">
            Showing 1-{{ 1 * f.show.perPage * f.show.page }} of
            {{ format.num(stats.results) }}
          </template>
          <br />
          Filtered out {{ format.num(stats.filtered) }} of
          {{ format.num(stats.amount) }} games
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\interface.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Tue Mar 26 2024
 **/

export default {
  name: 'SearchInterface',
  props: {
    source: {
      type: [String, Array],
      default: 'all', // 'library', []
    },

    filters: {
      type: Object,
      default: () => ({}),
    },

    preset: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      f: {},
      slug: null,

      base: {
        string: '',

        sortBy: 'score',
        sortDir: 'desc',

        states: [],
        genres: [],

        modes: {
          // states: 'any(of) // all(of) // not(of)'
        },

        show: {
          page: 1,
          perPage: 28,

          display: 'grid',
        },
      },

      table: {
        page: 1,
        perPage: 10,
      },

      presets: {
        'my-preset': {
          string: 'my preset',
        },
      },

      ui: {
        dirty: false,
        ready: false,
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useRepositoryStore),
    ...mapState(useRepositoryStore, ['genres']),

    isLibrary() {
      return this.source == 'library'
    },

    stats() {
      if (!this.ui.ready) return {}
      return this.$refs?.results?.stats || {}
    },
  },

  watch: {
    '$app.ready': function () {
      this.init()
    },
  },

  methods: {
    onLoading(loading) {
      this.ui.loading = loading
      console.warn('loading', loading)
    },

    onUpdate(filters) {
      this.f = filters

      this.f.show.page = 1
      this.ui.dirty = true

      this.search('interface')
      // console.warn('📒 updated', JSON.stringify(filters))
      // this.$nextTick(() => {
      //   console.warn('📒 updated 2', JSON.stringify(filters))
      // })
    },

    addPage() {
      this.f.show.page++
      this.search('addPage')
    },

    search(by) {
      // console.warn('📒 search')
      this.$nextTick(() => {
        this.$refs.results.search(by)
      })
    },

    //+-------------------------------------------------
    // mergeFilters()
    // Initializes this.f
    // With values from props and presets
    // -----
    // Created on Tue Nov 14 2023
    // Updated on Sun Jan 28 2024 - Added slug param
    //+-------------------------------------------------
    mergeFilters() {
      const loaded = {}

      if (this.slug && this.genres.length) {
        const genre = this.genres.find((g) => g.slug == this.slug)
        loaded.genres = [genre.id]
      }

      this.f = {
        ...this.base,
        ...(this.preset ? this.presets[this.preset] : {}),
        ...this.filters,
        ...loaded,
      }
      // console.warn('📒 mounted filters')
    },

    async getData() {
      this.slug = this.$route.params?.slug || null

      // if (this.slug) await this.repositoryStore.getGenres()
      // else this.repositoryStore.getGenres()

      if (this.isLibrary) return
      this.repositoryStore.topGames('popular')
    },

    async init() {
      if (!this.$app.ready) return

      await this.getData()
      this.mergeFilters()
      this.search('init')

      this.ui.ready = true
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('data:updated', () => {
      log('✨ Search: event -> data:updated')
      this.search('event')
    })

    this.$mitt.on('data:ready', () => {
      log('✨ Search: event -> data:ready')
      // this.control.event = 'data:ready'
      if (this.ui.dirty) return

      this.search('event')
    })
  },

  beforeUnmount() {
    this.$mitt.off('data:ready')
    this.$mitt.off('data:updated')
  },
}
</script>
