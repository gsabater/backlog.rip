<template>
  <ClientOnly>
    <div
      class="game-list-horizontal"
      :class="{
        'game-list--center': align === 'center',
        'game-list--left': align === 'left',
      }">
      <div v-if="items.length || loading" class="game-list-scroll">
        <div class="game-list-items">
          <b-game
            v-for="(app, i) in resolvedItems"
            :key="app"
            type="card"
            :uuid="app"
            :visible="visibleProps"
            :display="displayProps"
            class="game-list-item">
            <template v-if="showRank" #game:prepend>
              <div class="game-list-rank">
                <div
                  class="font-serif"
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

            <template v-if="$slots.actions" #actions>
              <slot name="actions" :item="app" :index="i"></slot>
            </template>
          </b-game>

          <div v-if="loading" class="game-list-item game-list-loading">
            <div class="card-game">
              <div class="loading-content">
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

      <!-- Hidden search-results component for sorting -->
      <search-results
        ref="results"
        @search:end="onSearchEnd"
        style="display: none"></search-results>
    </div>
  </ClientOnly>
</template>

<script>
/**
 * @file:    \components\game\List.vue
 * @desc:    A reusable game list component with horizontal layout
 * ----------------------------------------------
 * Created Date: 28th November 2025
 **/

export default {
  name: 'GameList',

  props: {
    // Array of game UUIDs or objects with id.api to display
    items: {
      type: Array,
      default: () => [],
    },

    // Whether to enable sorting via search-results
    enableSorting: {
      type: Boolean,
      default: false,
    },

    // Props to display on each game
    displayProps: {
      type: Array,
      default: () => ['name', 'score', 'released'],
    },

    // Visible props for the game component
    visibleProps: {
      type: Array,
      default: () => [],
    },

    // Loading state
    loading: {
      type: Boolean,
      default: false,
    },

    // Alignment of items: 'center' or 'left'
    align: {
      type: String,
      default: 'center',
      validator: (value) => ['center', 'left'].includes(value),
    },

    // Show ranking numbers
    showRank: {
      type: Boolean,
      default: true,
    },

    // Auto-fetch missing games from API
    autoFetch: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['search:end'],

  data: () => ({
    searchPing: 0,
    isFetching: false,
    _resolved: [],
  }),

  computed: {
    ...mapStores(useDataStore),

    //+-------------------------------------------------
    // resolvedItems()
    // Converts items to UUIDs and optionally sorts them
    // -----
    // Created on Thu Nov 28 2025
    //+-------------------------------------------------
    resolvedItems() {
      // Convert items to UUIDs
      let uuids = this.items
        .map((item) => {
          if (typeof item === 'string') return item
          return item?.id?.api || null
        })
        .filter(Boolean)

      // Prefer resolved cache if available
      if (this._resolved?.length) uuids = this._resolved

      // Apply sorting if enabled
      if (!this.enableSorting || !this.$refs.results?.items || this.searchPing === 0) {
        return uuids
      }

      const sortedUUIDs = this.$refs.results.items
      const games = []

      sortedUUIDs.forEach((uuid) => {
        if (uuids.includes(uuid)) {
          games.push(uuid)
        }
      })

      return games.length ? games : uuids
    },
  },

  watch: {
    items: {
      handler() {
        this.checkAndFetchMissingGames()
      },
      immediate: true,
    },
  },

  methods: {
    //+-------------------------------------------------
    // onSearchEnd()
    // Triggered when search-results finishes sorting
    // -----
    // Created on Thu Nov 28 2025
    //+-------------------------------------------------
    onSearchEnd() {
      this.searchPing++
      this.$emit('search:end')
    },

    //+-------------------------------------------------
    // triggerSort()
    // Public method to trigger sorting via search-results
    // -----
    // Created on Thu Nov 28 2025
    //+-------------------------------------------------
    triggerSort() {
      if (!this.enableSorting || !this.$refs.results) return
      this.$refs.results.search()
    },

    //+-------------------------------------------------
    // checkAndFetchMissingGames()
    // Checks if games exist in data store, if not fetches them from API
    // -----
    // Re-added on Thu Nov 28 2025
    //+-------------------------------------------------
    async checkAndFetchMissingGames() {
      if (!this.autoFetch || this.isFetching || !this.items?.length) {
        this.resolveItems()
        return
      }

      const missing = { api: [], steam: [], amount: 0 }
      const resolved = []

      for (const item of this.items) {
        const apiId = typeof item === 'string' ? item : item?.id?.api
        const steamId = typeof item === 'object' ? item?.id?.steam : null

        if (!apiId && !steamId) continue

        const exists = apiId ? this.dataStore.get(apiId) : null

        if (exists && !exists.error) {
          resolved.push(apiId)
        } else {
          if (apiId) missing.api.push(apiId)
          else if (steamId) missing.steam.push(steamId)
        }
      }

      missing.amount = missing.api.length + missing.steam.length

      // If there are missing games, fetch them
      if (missing.amount > 0) {
        this.isFetching = true
        try {
          const dataService = await import('~/services/dataService.js')
          dataService.default.init()
          await dataService.default.getBatch(missing)
        } catch (error) {
          console.error('[GameList] Error fetching missing games:', error)
        } finally {
          this.isFetching = false
        }
      }

      // Resolve items to UUIDs after fetch/no-fetch
      this.resolveItems()
    },

    //+-------------------------------------------------
    // resolveItems()
    // Converts items array to UUIDs and caches them
    // -----
    // Re-added on Thu Nov 28 2025
    //+-------------------------------------------------
    resolveItems() {
      this._resolved = this.items
        .map((item) => {
          if (typeof item === 'string') return item
          return item?.id?.api || null
        })
        .filter(Boolean)
    },
  },
}
</script>

<style scoped>
.game-list-horizontal {
  width: 100%;
  position: relative;
}

.game-list-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  padding-bottom: 0.5rem;
}

.game-list-scroll::-webkit-scrollbar {
  height: 6px;
}

.game-list-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.game-list-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.game-list-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.game-list-items {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
}

.game-list--center .game-list-items {
  justify-content: center;
}

.game-list--left .game-list-items {
  justify-content: flex-start;
}

.game-list-item {
  flex-shrink: 0;
}

.game-list-rank {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  min-width: 33px;
  text-align: center;
}

.game-list-loading {
  min-width: 200px;
}

.loading-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #a1c6cb0f;
  padding: 20px;
  border: 1px dashed #777777;
  width: 100%;
  cursor: pointer;
  border-radius: 2px;
  aspect-ratio: 27 / 40;
  flex-direction: column;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
}

.list-gold {
  color: #ffd700;
  font-weight: 600;
}

.list-silver {
  color: #c0c0c0;
  font-weight: 600;
}

.list-bronze {
  color: #cd7f32;
  font-weight: 600;
}

/* Mobile scroll hint */
@media (max-width: 768px) {
  .game-list-scroll {
    scroll-snap-type: x mandatory;
  }

  .game-list-item {
    scroll-snap-align: start;
  }
}
</style>
