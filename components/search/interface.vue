<template>
  <div class="row">
    <div class="col-12">
      <pre
        class="d-none my-3"
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
</pre
      >
    </div>
    <search-filters :filters="f" @update="onUpdate"></search-filters>

    <div class="col-12">
      <div v-if="false" class="row mb-4 align-items-center">
        <div class="col col-3">
          <div>
            <!-- <b-input
              v-model="f.string"
              placeholder="Filter..."
              clearable
              @tick="search"
              @clear="search"></b-input> -->
          </div>
        </div>
        <div class="col col-6">
          <button
            v-tippy="'Filter by game state'"
            :class="'btn py-2 ps-3 ' + (f.state ? 'pe-2' : 'pe-3')"
            style="transform: scale(0.9) translateX(-5px)">
            <Icon size="19" class="text-muted me-1">Background</Icon>
            <div :class="{ 'pe-2 me-2 border-end': f.state }">State</div>
            <BState v-if="f.state" :state="f.state" :label="true" :pulse="false"></BState>
          </button>
          <BMenuStates
            v-model="f.state"
            :clearable="true"
            @clear="search"
            @change="search"></BMenuStates>

          <!-- <b-btn
            v-if="
              !table.filters.played ||
              !table.filters.unplayed ||
              table.filters.search.length > 0
            "
            variant="ghost"
            color="secondary"
            @click="resetFilters">
            Reset
            <svg
              style="margin-right: 0; margin-left: 5px"
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-square-rounded-x"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 10l4 4m0 -4l-4 4"></path>
              <path
                d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
            </svg>
          </b-btn> -->
        </div>
        <div class="col text-end">
          <div v-tippy="'Filter the games'" class="btn py-2 ps-3 pe-2 scale-90">
            <Icon size="19" class="text-muted me-1">
              {{ f.sortDir == 'asc' ? 'SortAscending' : 'SortDescending' }}
            </Icon>
            <div class="pe-2 me-2 border-end">Sort by</div>
            <span class="badge bg-indigo-lt">
              {{ sortToHuman[f.sortBy] }}
              <Icon class="text-muted" size="11">ArrowDown</Icon>
            </span>
          </div>
          <b-menu>
            <label
              class="dropdown-item ps-1"
              :class="{ active: f.sortBy == 'rand' }"
              @click="f.sortBy = 'rand'">
              <div class="d-flex justify-center" style="width: 30px">
                <Icon size="16" class="me-1">Dice</Icon>
              </div>
              Random
              <!-- <div class="ms-auto">AZ</div> -->
              <!-- <span class="text-muted">Sorting by Name descending</span> -->
            </label>

            <div class="w-100 border-top my-1"></div>

            <label
              class="dropdown-item ps-1"
              :class="{ active: f.sortBy == 'name' }"
              @click="f.sortBy = 'name'">
              <div class="d-flex justify-center" style="width: 30px">
                <Icon size="16" class="me-1">SortAscendingLetters</Icon>
              </div>
              Name
              <!-- <div class="ms-auto">AZ</div> -->
              <!-- <span class="text-muted">Sorting by Name descending</span> -->
            </label>

            <label
              class="dropdown-item ps-1"
              :class="{ active: f.sortBy == 'score' }"
              @click="f.sortBy = 'score'">
              <div class="d-flex justify-center" style="width: 30px">
                <Icon size="16" class="me-1">SortDescendingNumbers</Icon>
              </div>
              <span class="pe-3">Median score</span>
              <tippy
                class="text-muted ms-auto cursor-help"
                :content="'The median score is ....'">
                <Icon>HelpCircleFilled</Icon>
              </tippy>
              <!-- <div class="ms-auto">AZ</div> -->
              <!-- <span class="text-muted">Sorting by Name descending</span> -->
            </label>

            <label
              class="dropdown-item ps-1"
              :class="{ active: f.sortBy == 'playtime' }"
              @click="f.sortBy = 'playtime'">
              <div class="d-flex justify-center" style="width: 30px">
                <Icon size="16" class="me-1">AlarmAverage</Icon>
              </div>
              Your playtime
              <!-- <div class="ms-auto">AZ</div> -->
              <!-- <span class="text-muted">Sorting by Name descending</span> -->
            </label>

            <div class="w-100 border-top my-1"></div>

            <label
              class="dropdown-item ps-1"
              :class="{ active: f.sortBy == 'hltb' }"
              @click="f.sortBy = 'hltb'">
              <div class="d-flex justify-center" style="width: 30px">
                <Icon size="16" class="me-1">TimeDuration30</Icon>
              </div>
              How long to beat
              <!-- <div class="ms-auto">AZ</div> -->
              <!-- <span class="text-muted">Sorting by Name descending</span> -->
            </label>
          </b-menu>
          <!-- <small class="text-muted">
            Found {{  }} games,
            <br />
            666 in your library
          </small> -->

          <!-- <button type="button" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-checkbox"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 11l3 3l8 -8"></path>
                    <path
                      d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"></path>
                  </svg>
                  Toggle all
                </button>
                <b-btn @click="doit">doit</b-btn> -->
        </div>
      </div>

      <search-results
        ref="results"
        :filters="f"
        :source="source"
        @loading="onLoading"></search-results>

      <div class="pagination my-3">
        <div class="btn" @click="addPage">Show more</div>
      </div>
    </div>

    <div v-if="false" class="col-3">
      show:
      <br />
      all games z-z only owned
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\interface.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Mon Feb 12 2024
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

        filters: {
          search: '',
          played: true,
          unplayed: true,
        },
      },

      presets: {
        'my-preset': {
          string: 'my preset',
        },
      },

      ui: {
        dirty: false,
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

    // TODO: move to a helper
    sortToHuman() {
      return {
        name: 'Name',
        score: 'Score',
        playtime: 'Playtime',
        hltb: 'How long to beat',
      }
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

      this.dataStore.getTop('popular')

      // this.db.states = this.dataStore
      //   .states()
      //   .reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
    },

    async init() {
      await this.getData()
      this.mergeFilters()
      this.search('init')
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('data:updated', () => {
      log('✨ Search: event -> data:updated')
      // this.control.event = 'data:updated'
      // if (this.ui.dirty) return

      this.search('event')
      // this.$emit('loading', false)
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
