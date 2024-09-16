<template>
  <v-dialog v-model="ui.show" max-width="650">
    <v-card>
      <template v-slot:title>
        <Icon>SquareRoundedPlus</Icon>
        Add a new game
      </template>

      <v-form ref="form" v-model="ui.isValid" @submit.prevent="search">
        <v-card-text class="px-5 mb-2">
          <div class="row g-3">
            <div class="col-12 m-0">
              <div class="text-secondary">
                Go ahead and search for a game. If it's there, it'll be linked up and
                available for everyone to check out. If not, no worries—you can just
                create any game you want for yourself!
              </div>
            </div>
            <div class="col-12">
              <div class="form-label">Search any game</div>
              <v-text-field
                ref="name"
                v-model="item.name"
                npersistent-hint
                nhint="This is only you display name" />
            </div>

            <div v-if="ui.empty" class="col-12">
              <div class="alert alert-warning">
                <Icon>Info</Icon>
                No games found with the name
                <strong>{{ item.name }}</strong>

                <div class="text-muted d-flex justify-between align-items-center">
                  <span>Try searching for another game</span>
                  <v-btn color="deep-purple-lighten-2" text @click="search">
                    Search again
                  </v-btn>
                </div>
              </div>
            </div>

            <div v-if="db.items.length" class="col-12">
              <div class="card">
                <div class="list-group card-list-group list-group-hoverable">
                  <div
                    v-for="item in db.items"
                    @click="add(item)"
                    class="list-group-item p-2 cursor-pointer"
                    :class="{ 'disabled opacity-25': isInLibrary(item) }"
                    style="border-style: solid">
                    <div class="row g-4 align-items-center">
                      <div class="col-2 d-flex justify-center">
                        <img
                          v-if="item.cover"
                          loading="lazy"
                          :src="`https://images.igdb.com/igdb/image/upload/t_logo_med/${item.cover.igdb}.png`"
                          class="b-poster"
                          style="max-width: 50px; max-height: 50px" />
                      </div>
                      <div class="col">
                        <p class="d-block mb-1">
                          {{ item.name }}
                        </p>

                        <template v-if="isInLibrary(item)">
                          <Icon size="15" style="transform: translateY(-1px)">
                            Forbid
                          </Icon>
                          This game is already in your library
                        </template>

                        <div class="d-flex g-2" v-else>
                          <small class="text-muted">
                            <template v-if="item.released_at">
                              {{ $moment(item.released_at * 1000).format('YYYY') }} •
                            </template>
                            <!-- {{ company(item) }} -->
                            {{ platforms(item) }}
                          </small>
                        </div>
                      </div>
                      <div class="col-auto">
                        <v-btn
                          size="small"
                          variant="outlined"
                          color="indigo"
                          class="list-group-item-actions me-2">
                          Add to library
                        </v-btn>
                        <span class="list-group-item-actions">
                          <Icon>ChevronRight</Icon>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <template v-if="ui.loading">
              <v-progress-linear
                color="deep-purple accent-4"
                indeterminate
                rounded
                height="4"></v-progress-linear>
            </template>
            <template v-else>
              <div class="col-6">
                <v-btn
                  block
                  color="deep-purple-lighten-2"
                  :variant="!item.name ? 'tonal' : 'text'"
                  :disabled="!item.name"
                  @click="add">
                  Create for myself
                </v-btn>
              </div>

              <div class="col-6">
                <v-btn
                  color="deep-purple-lighten-2"
                  block
                  @click="search"
                  variant="tonal"
                  :disabled="!item.name">
                  Search game
                </v-btn>
              </div>
            </template>
          </div>
          <!-- <div v-if="item.key">
            <label class="form-label">Special category</label>
            <small class="form-hint">
              <span class="badge">{{ item.key }}</span>
              This is a special and unique state utilized for generating personalized
              recommendations and statistics. Is becuase of this that it cannot be
              deleted.
            </small>
          </div> -->
        </v-card-text>

        <!-- <v-card-actions
          v-if="!ui.loading"
          class="p-2"
          style="border-top: 1px dashed rgb(204 204 204 / 20%)">
          <v-btn
            color="deep-purple-lighten-2"
            text="Reserve"
            block
            border
            @click="reserve"></v-btn>

          <v-spacer></v-spacer>
          <v-btn
            variant="plain"
            class="mx-2"
            @click="ui.show = false"
            :disabled="ui.loading">
            Close
          </v-btn>
          <v-btn
            color="primary"
            class="mx-2 px-5"
            elevation="1"
            variant="elevated"
            @click="submit"
            :disabled="ui.loading">
            Save
          </v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"></v-progress-linear>
        </v-card-actions> -->
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\game\Add.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 26th June 2024
 * Modified: Thu 12 September 2024 - 16:42:34
 **/

//+-------------------------------------------------
// TODO
// [] linked games are not saved in ddbb
// [] Sometimes a game is not detected as owned
// - Check the witcher 3 292030 // 1942 IGDB
// -----
// Created on Tue Jul 09 2024
//+-------------------------------------------------

export default {
  name: 'NewGameDialog',
  data: () => ({
    item: { name: '' },
    db: { items: [] },

    ui: {
      show: false,
      empty: false,
      loading: false,
      isValid: false,
    },
  }),

  computed: {
    ...mapStores(useGameStore, useDataStore, useStateStore, useRepositoryStore),
  },

  methods: {
    platforms(item) {
      if (!item.platforms) return null

      const filtered = item.platforms.filter((platform) => {
        if (!platform.abbreviation) return false
        if (platform.abbreviation.includes('][')) return false

        return true
      })

      return filtered.map((platform) => '' + platform.abbreviation).join(', ')
    },

    company(item) {
      if (!item.companies) return null

      let developer = item.companies.find((company) => company.developer)
      if (developer) return developer.name

      return item.companies[0].name
    },

    isInLibrary(item) {
      return this.dataStore.isInLibrary(item, true)
    },

    //+-------------------------------------------------
    // show()
    // Displays the modal
    //+-------------------------------------------------
    show() {
      this.db.items = []
      this.item = { name: '' }

      this.ui.show = true
      this.ui.empty = false

      this.$nextTick(() => {
        this.$refs.name?.focus()
        this.$refs.name?.select()
      })
    },

    //+-------------------------------------------------
    // search()
    // Searches
    // -----
    // Created on Thu Jun 27 2024
    //+-------------------------------------------------
    async search() {
      this.ui.empty = false
      this.ui.loading = true

      let xhr = await this.repositoryStore.searchGames(this.item.name)
      if (!xhr.length) this.ui.empty = true
      this.db.items = xhr

      this.ui.loading = false
    },

    //+-------------------------------------------------
    // add()
    // Creates a new game just for you
    // -----
    // Created on Tue Jul 02 2024
    //+-------------------------------------------------
    async add(item = null) {
      item = item || this.item
      item = JSON.parse(JSON.stringify(item))

      let app = this.gameStore.create(item)
      app.name = app.name || this.item.name
      app.description = app.summary

      delete app.k
      delete app.genres
      delete app.summary
      delete app.epic_id
      delete app.category
      delete app.platforms

      delete app.isTrusted
      delete app._vts

      this.dataStore.process(app, 'add:new')
      this.$toast.success(item.name + ' has been added to your library')

      this.ui.show = false
    },
  },

  mounted() {
    this.$mitt.on('game:add', (payload) => {
      this.show(payload)
    })
  },
}
</script>
