<template>
  <Command.Dialog :visible="ui.show" theme="backlog">
    <template #header>
      <div
        v-if="ui.tab"
        command-linear-badge
        style="text-transform: capitalize; cursor: pointer"
        @click="ui.tab = null">
        {{ ui.tab }}

        <Icon size="16" class="ms-2">X</Icon>
      </div>
      <!-- <Command.Input placeholder="Type a command or search..." @update:value="search" /> -->
      <input
        ref="input"
        v-model="searchString"
        command-input
        auto-focus
        auto-complete="off"
        auto-correct="off"
        spell-check="false"
        aria-autocomplete="list"
        role="combobox"
        aria-expanded="true"
        placeholder="Search for a game, genre, or command..."
        @keyup="search" />
    </template>
    <template #body>
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group v-if="ui.tab == null && _navigation.length" heading="Navigation">
          <Command.Item
            v-for="(item, i) in _navigation"
            :key="'goTo' + i"
            :shortcut="item.shortcut"
            @select="handleSelectItem(item)">
            <Icon>{{ item.icon || 'ArrowRight' }}</Icon>
            {{ item.label }}
          </Command.Item>
        </Command.Group>

        <Command.Group v-if="ui.tab == null && searchString.length == 0" heading="Search">
          <Command.Item
            v-for="(item, i) in toSearch"
            :key="'search' + i"
            :data-value="item.text"
            :shortcut="item.shortcut"
            @select="handleSelectItem(item)">
            <Icon>{{ item.icon || 'ArrowRight' }}</Icon>
            {{ item.label }}
          </Command.Item>
        </Command.Group>

        <Command.Group
          v-if="
            _genres.length && (ui.tab == 'genres' || (!ui.tab && searchString.length > 0))
          "
          heading="Genres">
          <Command.Item
            v-for="item in _genres"
            :key="'genre' + item.id"
            @select="handleSelectItem({ goto: '/games/' + item.slug })">
            <Icon>Triangle</Icon>
            View games in
            <strong>{{ item.name }}</strong>
          </Command.Item>
        </Command.Group>

        <Command.Group
          v-if="
            _games.length && (ui.tab == 'games' || (!ui.tab && searchString.length > 0))
          "
          :heading="ui.tab == 'games' ? '' : 'Games'">
          <Command.Item
            v-for="(item, i) in _games"
            :key="'game' + i"
            class="command-item-game"
            :data-value="item.name + ' ' + item.steam_id"
            @select="handleSelectItem({ modal: item.uuid })">
            <!-- <div
              style="
                width: 100px;
                height: 30px;
                display: flex;
                display: flex;
                justify-content: center;
                align-items: center;
              "> -->
            <game-asset
              ref="logo"
              class="asset-banner"
              :app="item"
              asset="banner"
              fallback="logo"
              :priority="['steam', 'igdb']"></game-asset>
            <!-- </div> -->
            <div>
              {{ item.name }}
              <small v-if="searchString == item.steam_id" class="d-block text-secondary">
                Steam ID: {{ item.steam_id }}
              </small>

              <small v-else class="d-block text-secondary">
                UUID: {{ item.uuid ?? '---' }}
              </small>
            </div>
            <!-- <b-state></b-state> -->
          </Command.Item>
        </Command.Group>
      </Command.List>
    </template>
    <template #footer>
      <b-btn
        variant="ghost"
        size="sm"
        color="secondary"
        style="margin: 25px 0"
        @click="handleSelectItem({ goto: '/games' })">
        See all {{ format.num($app.count.api) }} games
      </b-btn>
      <!-- <div class="command-palette-logo"></div> -->
      <ul class="command-palette-commands p-0 m-0">
        <li>
          <kbd class="command-palette-commands-key">
            <svg width="15" height="15" aria-label="Enter key" role="img">
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.2">
                <path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" />
              </g>
            </svg>
          </kbd>
          <span class="command-palette-Label">to select</span>
        </li>
        <li>
          <kbd class="command-palette-commands-key">
            <svg width="15" height="15" aria-label="Arrow down" role="img">
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.2">
                <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
              </g>
            </svg>
          </kbd>
          <kbd class="command-palette-commands-key">
            <svg width="15" height="15" aria-label="Arrow up" role="img">
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.2">
                <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" />
              </g>
            </svg>
          </kbd>
          <span class="command-palette-Label">to navigate</span>
        </li>
        <li>
          <kbd class="command-palette-commands-key">
            <svg width="15" height="15" aria-label="Escape key" role="img">
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.2">
                <path
                  d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956" />
              </g>
            </svg>
          </kbd>
          <span class="command-palette-Label">to close</span>
        </li>
      </ul>
    </template>
  </Command.Dialog>

  <search-results
    ref="results"
    :filters="{
      string: searchString,
      sortBy: 'score',
      sortDir: 'desc',
      show: {
        page: 1,
        perPage: 28,
      },
    }"
    @search:start="onSearched"
    @search:end="onSearched">
    <template #body>
      <div></div>
    </template>
  </search-results>
</template>

<script>
/**
 * @file:    \components\search\palette.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th March 2024
 * Modified: Thu Apr 11 2024
 **/

export default {
  name: 'SearchPalette',

  data() {
    return {
      searched: '',
      searchString: '',

      games: [],

      navigation: [
        {
          label: 'Go to dashboard',
          goto: '/dashboard',
        },
        {
          label: 'Go to all games',
          goto: '/games',
        },

        {
          label: 'Go to your library',
          goto: '/library',
        },
      ],

      toSearch: [
        {
          label: 'View games',
          icon: 'Search',
          tab: 'games',
        },
        {
          label: 'View genres',
          icon: 'Triangle',
          tab: 'genres',
        },
      ],

      preferences: [
        {
          label: 'Toggle Dark Mode',
          shortcut: ['⇧', 'D'],
        },
      ],

      ui: {
        tab: null,
        show: false,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useRepositoryStore),
    ...mapState(useRepositoryStore, ['genres', 'loaded']),

    _navigation() {
      const items = []
      this.navigation.forEach((item) => {
        const name = item.label.toLowerCase()
        if (name.indexOf(this.searchString) > -1) {
          items.push(item)
        }
      })
      return items
    },

    //+-------------------------------------------------
    // _genres()
    // Filtered array of genres from the store genres arr
    // -----
    // Created on Tue Mar 26 2024
    //+-------------------------------------------------
    _genres() {
      const items = []

      this.genres.forEach((item) => {
        const name = item.name.toLowerCase()
        if (name.indexOf(this.searchString) > -1) {
          items.push(item)
        }
      })

      return items
    },

    //+-------------------------------------------------
    // games()
    // Computed property to get games from the $ref
    // -----
    // Created on Fri Mar 22 2024
    //+-------------------------------------------------
    _games() {
      if (!this.$refs.results?.items) return []
      const games = []

      this.$refs.results.items?.forEach((uuid) => {
        games.push(this.dataStore.get(uuid))
      })

      return games.slice(0, 20)
    },
  },

  methods: {
    show() {
      this.getData()
      this.ui.show = true

      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    async hide() {
      this.ui.show = false

      await delay(333)
      this.searchString = ''
      this.ui.tab = null
    },

    back() {
      if (this.searchString == '') {
        this.ui.tab = null
      }
    },

    //+-------------------------------------------------
    // handleSelectItem()
    // Performs actions on item
    // -----
    // Created on Thu Mar 21 2024
    //+-------------------------------------------------
    handleSelectItem(item) {
      log('#️⃣ handle', item)

      if (item.tab) {
        this.ui.tab = item.tab
      }

      if (item.goto) {
        this.$router.push(item.goto)
        this.hide()
      }

      if (item.modal) {
        this.$mitt.emit('game:modal', {
          uuid: item.modal,
        })
      }
    },

    onSearched(ev) {
      console.warn('searched', ev)

      // if (!this.$refs.results?.items) return []
      // const games = []

      // this.$refs.results.items?.forEach((uuid) => {
      //   games.push(this.dataStore.get(uuid))
      // })

      // return games.slice(0, 20)
    },

    //+-------------------------------------------------
    // search()
    // Performs a search
    // -----
    // Created on Fri Mar 22 2024
    //+-------------------------------------------------
    search() {
      if (!this.ui.show) return
      if (this.searchString == this.searched) return

      this.searched = this.searchString

      this.$nextTick(() => {
        if (!this.$refs.results) return
        if (this.searchString.length || this.ui.tab == 'games') {
          this.$refs.results.search('palette')
        }
      })
    },

    // async getGenres() {
    //   if (this.db.genres.length == 0) {
    //     this.db.genres = await this.repositoryStore.getGenres()
    //   }
    // },

    async getGames() {
      if (this.loaded.includes(`top:popular`)) return
      this.repositoryStore.topGames('popular')
    },

    async getData() {
      this.getGames()
      // this.getGenres()
    },

    async init() {
      await delay(300)

      this.$ev.register('palette', {
        show: this.show,
        hide: this.hide,
        back: this.back,
      })

      // Add the event listener to a parent element
      document.body.addEventListener('click', (event) => {
        // Check if the event target has the specified class
        if (event.target.matches('[command-dialog-mask]')) {
          if (this.ui.show) this.hide()
        }
      })
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('search:palette', () => {
      this.show()
      console.warn('search:palette')
    })

    // this.$mitt.on('data:updated', () => {
    //   this.search()
    // })
  },
}
</script>
