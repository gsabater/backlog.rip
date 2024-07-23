<template>
  <div class="row">
    <div class="col-12">
      <pre
        class="d-none my-3"
        style="
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 9999;
          max-height: 350px;
          overflow-y: scroll;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 10px;
          border-radius: 5px;
          width: auto;
        "><h3>Search interface</h3>
{{ f }}
--
{{ stats }}
</pre>
    </div>
    <search-filters :filters="f" @updated="onUpdateFilters"></search-filters>

    <div class="col-12">
      <search-results
        ref="results"
        :filters="f"
        :source="source"
        @search:end="onSearchEnd"></search-results>

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
            <b-btn to="/import/steam" class="me-3">
              <!-- <Icon>StepInto</Icon> -->
              Import your library
            </b-btn>

            <b-btn @click.stop="$mitt.emit('game:add')" class="me-3">
              Manually add a game
            </b-btn>

            <b-btn to="/games">Browse all games</b-btn>
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
            Showing up to
            <strong>{{ showing }} of {{ format.num(stats.results) }}</strong>
            results
          </template>
          <br />
          <template v-if="stats.filtered > 0">
            Filtered out
            <strong>
              {{ format.num(stats.filtered) }} of {{ format.num(stats.amount) }}
            </strong>
          </template>
          <span v-else>No games filtered</span>
        </p>
      </div>

      <div v-else class="d-none">{{ f.show }} {{ stats }}</div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\interface.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: 23 July 2024 - 15:58:47
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
        released: null,

        mods: {
          // states: 'any(of) // all(of) // not(of)'
        },

        show: {
          page: 1,
          perPage: 28,

          display: 'grid',
          card: ['default'],
        },
      },

      presets: {
        'my-preset': {
          string: 'my preset',
        },
      },

      ui: {
        ping: 0,
        dirty: false,
        ready: false,
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useRepositoryStore),
    ...mapState(useStateStore, ['states']),
    ...mapState(useRepositoryStore, ['genres']),

    //+-------------------------------------------------
    // isLibrary()
    // Returns true when browsing library
    //+-------------------------------------------------
    isLibrary() {
      return this.source == 'library'
    },

    //+-------------------------------------------------
    // stats()
    // Returns stats from results component
    // -----
    // Created on Fri Apr 05 2024
    //+-------------------------------------------------
    stats() {
      if (!this.ui.ready) return { state: 'not ready' }
      if (this.ui.ping == 0) return { state: 'no ping' }
      return this.$refs?.results?.stats || { state: 'no stats' }
    },

    showing() {
      return this.stats.results > this.f.show.perPage
        ? this.f.show.page * this.f.show.perPage
        : this.stats.results
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

    onUpdateFilters(filters) {
      this.f = filters

      this.f.show.page = 1
      this.ui.dirty = true

      this.search('interface')
      this.$nextTick(() => {
        this.ui.ping++
      })
    },

    onSearchEnd() {
      this.ui.ping++
    },

    addPage() {
      this.f.show.page++
      this.search('addPage')
    },

    search(by) {
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
    // Updated on Sun Jul 14 2024 - Use slug for special filters
    //+-------------------------------------------------
    mergeFilters() {
      const loaded = {}

      if (this.slug && this.genres.length) {
        const genre = this.genres.find((g) => g.slug == this.slug)
        if (genre) loaded.genres = [genre.id]
      }

      if (this.slug && this.states.length) {
        const state = this.states.find((g) => g.slug == this.slug)
        if (state) loaded.states = [state.id]
      }

      if (this.slug && ['pinned', 'hidden', 'favorites'].includes(this.slug)) {
        loaded.is = this.slug
      }

      this.f = {
        ...this.base,
        ...(this.preset ? this.presets[this.preset] : {}),
        ...this.filters,
        ...loaded,
      }

      // console.warn(this.f)
      // console.warn('📒 mounted filters')
    },

    async getData() {
      this.slug = this.$route.params?.slug || null
      if (this.slug && typeof this.slug == 'object') this.slug = this.slug[0]

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

    // this.$mitt.on('data:updated', () => {
    //   log('✨ Search: event -> data:updated')
    //   this.search('event')
    // })

    // this.$mitt.on('data:ready', () => {
    //   log('✨ Search: event -> data:ready')
    //   // this.control.event = 'data:ready'
    //   if (this.ui.dirty) return

    //   this.search('event')
    // })
  },

  beforeUnmount() {
    this.$mitt.off('data:ready')
    this.$mitt.off('data:updated')
  },
}
</script>
