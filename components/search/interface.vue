<template>
  <div class="row">
    <div class="col-3">
      <div class="mb-2" style="zoom: 0.9">
        <!-- <button type="button" class="btn">
          <Icon size="18" class="text-muted me-1">CirclePlus</Icon>
          <div
            :class="{
              'pe-2 me-2 border-end': !f.played || !f.unplayed,
            }">
            Presets
          </div>
          <span v-if="f.played && !f.unplayed" class="badge bg-indigo-lt">Played</span>
          <span v-if="!f.played && f.unplayed" class="badge">Not played</span>
        </button>
        <b-menu>
          <label class="dropdown-item">
            Played
            <span class="badge bg-primary text-primary-fg ms-auto">12</span>
          </label>

          <label class="dropdown-item">Not played</label>
        </b-menu> -->
      </div>

      <div style="zoom: 0.9">
        <b-input
          v-model="f.string"
          placeholder="Filter..."
          clearable
          @keydown="search"
          @clear="search"></b-input>
        <pre>
            {{ f.string }}
          </pre
        >
      </div>

      <div>
        <pre class="my-3" style="zoom: 0.9"
          >{{ f }}
---
{{ ui }}
---
{{ $app }}
</pre
        >
      </div>
    </div>

    <div class="col-9">
      <div class="row mb-2 align-items-center" style="zoom: 0.9">
        <div class="col col-4">
          <!-- <b-input
            v-model="table.filters.search"
            placeholder="Filter..."
            clearable></b-input> -->
        </div>
        <div class="col col-4">
          <!-- <button type="button" class="btn mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-circle-plus"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
              <path d="M9 12h6"></path>
              <path d="M12 9v6"></path>
            </svg>
            <div
              :class="{
                'pe-2 me-2 border-end': !table.filters.played || !table.filters.unplayed,
              }">
              Status
            </div>
            <span
              v-if="table.filters.played && !table.filters.unplayed"
              class="badge bg-indigo-lt">
              Played
            </span>
            <span v-if="!table.filters.played && table.filters.unplayed" class="badge">
              Not played
            </span>
          </button>
          <b-menu>
            <label class="dropdown-item">
              <input
                v-model="table.filters.played"
                class="form-check-input m-0 me-2"
                type="checkbox" />
              Played
            </label>

            <label class="dropdown-item">
              <input
                v-model="table.filters.unplayed"
                class="form-check-input m-0 me-2"
                type="checkbox" />
              Not played
            </label>
          </b-menu> -->
          <b-btn
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
          </b-btn>
        </div>
        <div class="col text-end">
          <!-- <small class="text-muted">
            Found {{ totalApiGames }} games,
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

      <search-results ref="results" :filters="f" :source="source"></search-results>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\interface.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Tue Dec 26 2023
 **/

export default {
  name: 'SearchInterface',
  props: {
    source: {
      type: String,
      default: 'all', // or 'library'
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

      base: {
        string: '',
        sortBy: 'name',

        show: {
          display: 'grid',
          page: 1,
          limit: 10,
          perPage: 10,
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

      ui: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),

    totalApiGames() {
      return this.$app?.api?.games?.total || 0
    },
  },

  methods: {
    search() {
      this.$nextTick(() => {
        log('⭕ Starting a search from the interface', JSON.stringify(this.f))
        this.$refs.results.search()
      })
    },

    //+-------------------------------------------------
    // mergeFilters()
    // Initializes this.f
    // With values from props and presets
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    mergeFilters() {
      this.f = {
        ...this.base,
        ...(this.preset ? this.presets[this.preset] : {}),
        ...this.filters,
      }
    },

    async getData() {
      this.dataStore.loadApiStatus()
      this.dataStore.getTop('popular')
    },

    init() {
      this.getData()
      this.mergeFilters()
    },
  },

  mounted() {
    // window.devi = this
    this.init()
  },
}
</script>
