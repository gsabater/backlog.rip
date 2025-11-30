<template>
  <v-dialog v-model="ui.show" max-width="650">
    <div class="game-details_modal">
      <div
        class="game-details-content game-card my-3"
        style="
          outline: 1px solid rgba(255, 255, 255, 0.15);
          outline-offset: -1px;
          box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
          border-radius: 4px;
        ">
        <div v-if="app && app.uuid" class="row w-100 h-100 g-0 m-0">
          <div
            class="d-md-flex col grainy-before"
            style="
              max-width: 350px;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: #24253b;
            ">
            <div class="cover ambilight" style="z-index: 1">
              <game-asset
                ref="cover"
                :app="app"
                asset="cover"
                class="locandina"
                :priority="['steam', 'igdb']"
                style="
                  max-height: 300px;
                  outline: 1px solid rgba(0, 0, 0, 0.3);
                  outline: 1px solid rgba(255, 255, 255, 0.15);
                  outline-offset: -1px;
                  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
                  border-radius: 4px;
                " />
            </div>
            <!-- <div class="blur_back" style="">
                <game-asset
                  ref="background"
                  :app="app"
                  asset="gen"
                  :priority="['steam']"></game-asset>
              </div> -->

            <!-- <div
              v-if="$prev"
              style="
                position: absolute;
                left: -35px;
                bottom: -10px;
                z-index: 9999;
                background-color: rgb(55, 49, 49);
                cursor: pointer;
                padding: 15px 20px;
                color: white;
                box-shadow: black 2px 2px 0px 0px;
                display: flex;
                align-items: center;
              "
              @click="load($prev)">
              <Icon size="18" width="2">ChevronLeft</Icon>
              <h4
                class="m-0"
                style="  font-weight: 500;
              margin-bottom: 8px;
              letter-spacing: normal;
              letter-spacing: 2px !important;
              text-transform: uppercase;
            }">
                Prev
              </h4>
            </div> -->
          </div>

          <!--
        *+---------------------------------
        *| Information column
        *+--------------------------------- -->
          <div class="col info_section">
            <div class="info-header">
              <!-- <div class="cover ambilight">
                <game-asset
                  ref="cover"
                  :app="app"
                  asset="logo"
                  class="locandina"
                  :priority="['steam', 'igdb']"
                  @click="ui.layout = ui.layout == 'full' ? 'lite' : 'full'"></game-asset>
              </div> -->
              <h2
                class="p-0"
                style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3); margin-bottom: 0.35rem">
                {{ app.name }}
              </h2>

              <div class="row">
                <div class="mb-3">
                  <template v-if="app._.releasedYear">
                    <strong class="text-muted">{{ app._.releasedYear }}</strong>
                  </template>

                  <!-- <template v-if="app.score">
                    <strong v-tippy="'Median score'" class="text-muted">
                      <Icon size="12" width="1" style="transform: translateY(-2px)">
                        StarFilled
                      </Icon>
                      {{ app.score }}
                    </strong>
                    <div class="d-inline-block px-2 opacity-50">🔸</div>
                  </template> -->

                  <client-only>
                    <div v-if="app._.releasedYear && genre" class="d-inline-block px-2 opacity-50">
                      🔸
                    </div>
                    <template v-if="genre">
                      <strong class="text-muted">{{ genre.name }}</strong>
                    </template>
                  </client-only>
                </div>

                <div class="">
                  <b-state ref="bstate" :app="app.uuid" :state="app.state">
                    <template #container="{ state }">
                      <v-btn
                        variant="tonal"
                        class="me-2"
                        size="small"
                        n:color="state.color || 'deep-purple-lighten-4'"
                        :style="{
                          '--tblr-status-color': state.color,
                          'noutline': '1px solid ' + state.color,
                        }"
                        @click.stop="$refs.bstate.showManager($event)">
                        <span v-if="state.id" class="status-dot status-dot-animated me-2"></span>
                        {{ state.name || 'Assign a state' }}
                        <Icon size="12" class="ms-1" style="transform: translateX(3px)">
                          ChevronDown
                        </Icon>
                      </v-btn>
                    </template>
                  </b-state>

                  <v-btn variant="text" size="small" class="me-2" color="pink-darken-2">
                    <Icon>{{ app.is.fav ? 'HeartFilled' : 'Heart' }}</Icon>
                  </v-btn>

                  <!-- <v-btn class="me-2" variant="tonal" size="small" color="blue-grey">
                  Add to a list
                  <Icon size="12" class="ms-2">ChevronDown</Icon>
                </v-btn> -->

                  <!-- <v-btn variant="tonal" size="small" class="me-2" color="blue-grey">
                  <Icon>Settings</Icon>
                </v-btn> -->
                </div>
              </div>

              <!-- <button
            v-tippy="'Filter by game state'"
            :class="'btn py-2 ps-3 pe-2'"
            style="transform: scale(0.9) translateX(-5px)">
            <Icon size="19" class="text-muted me-1">Background</Icon>
            <div class="pe-2 me-2 border-end">State</div>
            <BState :state="3" :label="true" :pulse="false"></BState>
          </button> -->
            </div>

            <div class="mt-3 mb-2">
              <p
                :class="{ 'text-muted': !app.description }"
                style="text-align: justify; margin: 0"
                :style="{
                  'display': '-webkit-box',
                  '-webkit-line-clamp': ui.expandedDescription ? 'unset' : '3',
                  '-webkit-box-orient': 'vertical',
                  'overflow': 'hidden',
                  'transition': 'all 0.3s ease',
                }"
                v-html="app.description || 'No description'"></p>
              <!-- <v-btn
                v-if="app.description"
                variant="text"
                size="small"
                color="primary"
                @click="ui.expandedDescription = !ui.expandedDescription">
                {{ ui.expandedDescription ? 'Show less' : 'Read more' }}
              </v-btn> -->
            </div>

            <!--
              *+---------------------------------
              *| Scores block
              *+--------------------------------- -->
            <div v-if="app.score" class="my-2">
              <h5>Scores</h5>
              <div class="d-flex align-items-start">
                <div
                  v-tippy="
                    'The median is the middle value in a set of scores when arranged in order. It avoids being skewed by extreme values, making it a fairer representation of the central tendency compared to the average.'
                  "
                  class="d-flex align-items-center text-muted small me-4">
                  <Icon size="14" width="1.2" class="me-2" style="transform: translateY(1px)">
                    Star
                  </Icon>

                  {{ app.score }}
                </div>

                <!--
                  *+---------------------------------
                  *| Steam score
                  *+---------------------------------
                -->

                <div
                  v-if="app.scores.steamscoreAlt"
                  v-tippy="'Recommendations on Steam'"
                  class="d-flex align-items-start text-muted small me-3">
                  <b-logo
                    name="steam"
                    size="14"
                    class="me-2"
                    style="transform: translate(-1px, 3px); opacity: 0.6" />

                  <div style="display: flex; flex-direction: column">
                    {{ app.scores.steamscoreAlt }}
                    <span style="transform: translateY(-1px)">
                      {{ app.scores.steamscore }}% of
                      {{ format.num(app.scores.steamCount) }}
                    </span>
                  </div>
                </div>

                <!--
                  *+---------------------------------
                  *| Metacritic
                  *+---------------------------------
                -->
                <div
                  v-if="app.scores.metascore || app.scores.userscore"
                  class="me-3"
                  style="display: flex; justify-content: center; transform: translateY(-2px)">
                  <b-logo
                    name="metacritic"
                    size="16"
                    class="me-2"
                    style="transform: translateX(-2px); opacity: 0.8" />
                  <div
                    v-tippy="'Metacritic score'"
                    class="text-muted me-1"
                    style="
                      display: flex;
                      width: 22px;
                      height: 22px;
                      border-radius: 3px;
                      align-items: center;
                      justify-content: center;
                      ncolor: black !important;
                      font-size: 12px;
                      font-weight: 400;
                    "
                    :style="{
                      border:
                        '1px solid ' + format.scoreToHuman(app.scores.metascore, 'meta', 'color'),
                    }">
                    {{ app.scores.metascore }}
                  </div>
                  <div
                    v-if="app.scores.userscore"
                    v-tippy="'Metacritic users'"
                    class="text-muted"
                    style="
                      display: flex;
                      width: 22px;
                      height: 22px;
                      border-radius: 3px;
                      align-items: center;
                      justify-content: center;
                      ncolor: black !important;
                      font-size: 12px;
                      font-weight: 400;
                    "
                    :style="{
                      border:
                        '1px solid ' + format.scoreToHuman(app.scores.userscore, 'meta', 'color'),
                    }">
                    {{ app.scores.userscore }}
                  </div>
                </div>

                <!--
                  *+---------------------------------
                  *| Opencritic
                  *+---------------------------------
                -->
                <div
                  v-if="app.scores.oc"
                  v-tippy="'Opencritic'"
                  class="d-flex align-items-center small"
                  style="ncolor: black">
                  <img
                    :src="
                      'https://steam-backlog.com/images/' +
                      format.scoreToHuman(app.scores.oc, 'oc', 'label') +
                      '-head.png'
                    "
                    style="max-width: 20px; max-height: 20px"
                    class="me-2" />

                  {{ app.scores.oc }}
                </div>
              </div>
            </div>

            <div v-if="app.hltb && app.hltb.main" class="my-2">
              <h5>Time to beat</h5>
              <small v-tippy="'Main game'" class="text-muted me-3">
                <Icon size="15" width="1.5" style="transform: translateY(-1px)" class="me-1">
                  SquareRoundedCheck
                </Icon>

                {{ dates.minToHours(app.hltb.main / 60) }}
              </small>
              <small v-tippy="'Main game with extras'" class="text-muted me-3">
                <Icon size="15" width="1.5" style="transform: translateY(-1px)" class="me-1">
                  DiscountCheck
                </Icon>
                {{ dates.minToHours(app.hltb.extras / 60) }}
              </small>
              <small v-if="app.hltb.comp" v-tippy="'Completionist'" class="text-muted me-3">
                <!-- <Icon
                  size="15"
                  width="1.5"
                  style="transform: translateY(-1px)"
                  class="me-1">
                </Icon> -->
                <span class="me-1" style="transform: translateY(-1px)">💯</span>
                {{ dates.minToHours(app.hltb.comp / 60) }}
              </small>

              <!-- <a
                v-tippy="hltbSource ? 'Click to open' : null"
                :href="hltbSource || null"
                :target="hltbSource ? '_blank' : null"
                class="text-muted"
                :class="{ disabled: !hltbSource }">
                <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                  Click
                </Icon>
                From HLTB
              </a> -->
            </div>

            <div class="mt-3 mb-2">
              <div class="btn-list">
                <!-- <div v-if="app.id.steam" class="btn-group btn-group-sm" role="group">
                  <a
                    v-tippy="'Open Steam store page'"
                    :href="'https://store.steampowered.com/app/' + app.id.steam"
                    class="btn btn-ghost-secondary btn-secondary tonal btn-sm pe-2"
                    style="border: 0"
                    target="_blank">
                    <Icon size="15" class="me-2">BrandSteam</Icon>
                    Steam page
                  </a>
                  <a
                    v-if="app.is.steam"
                    v-tippy="'Run or install the game through Steam'"
                    :href="'steam://run/' + app.id.steam"
                    class="btn btn-ghost-secondary btn-secondary tonal btn-sm m-0 ps-0 pe-1"
                    style="border: 0"
                    target="_blank">
                    ⚡
                  </a>
                </div> -->

                <v-btn
                  v-if="app.id.steam"
                  v-tippy="'Open Steam store page'"
                  variant="tonal"
                  size="small"
                  :href="'https://store.steampowered.com/app/' + app.id.steam"
                  target="_blank"
                  style="outline: rgb(108 122 145 / 40%) solid 1px">
                  <Icon size="15" class="me-2">BrandSteam</Icon>
                  Steam store
                </v-btn>

                <v-btn
                  v-if="app.has_demo"
                  v-tippy="'Play a free demo on Steam'"
                  :href="'https://store.steampowered.com/app/' + app.id.steam"
                  variant="text"
                  size="small"
                  target="_blank">
                  <Icon size="15" class="me-1">Download</Icon>

                  Demo
                </v-btn>

                <v-btn
                  v-if="app.id.xbox"
                  v-tippy="'Open Xbox page'"
                  variant="text"
                  size="small"
                  :href="`https://www.xbox.com/games/store/${app.slug}/${app.id.xbox}`"
                  target="_blank">
                  <Icon size="15" class="me-1">BrandXbox</Icon>
                  Xbox
                </v-btn>

                <!-- <a
              v-tippy="'Open Xbox store page'"
              :href="'https://store.steampowered.com/app/' + app.id.xbox"
              class="btn btn-ghost-secondary btn-secondary btn-sm"
              target="_blank">
              <Icon size="15" class="me-2">BrandXbox</Icon>
              Xbox store
            </a> -->
                <!-- <a v-tippy="'Open on Steam'" href="#" class="btn btn-icon btn-sm">
            <Icon>GitMerge</Icon>
          </a> -->
              </div>
            </div>

            <v-divider class="my-2"></v-divider>

            <div class="row my-2" style="border-radius: 3px">
              <div class="col-4">
                <v-btn
                  v-tippy="'Open Steam store page'"
                  block
                  variant="tonal"
                  style="outline: rgb(108 122 145 / 40%) solid 1px"
                  @click="loadARandomGame">
                  <Icon size="15" class="me-2">Refresh</Icon>
                  Show another
                </v-btn>
              </div>
              <div class="col-4">
                <b-state ref="bstate" :app="app.uuid" :state="app.state">
                  <template #container="{ state }">
                    <v-btn
                      block
                      variant="tonal"
                      style="outline: rgb(108 122 145 / 40%) solid 1px"
                      n:color="state.color || 'deep-purple-lighten-4'"
                      :style="{
                        '--tblr-status-color': state.color,
                        'noutline': '1px solid ' + state.color,
                      }"
                      @click.stop="$refs.bstate.showManager($event)">
                      <span
                        v-if="state.id"
                        class="status-dot status-dot-animated me-2"
                        style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.4)"></span>
                      {{ state.name || 'Assign a state' }}
                      <Icon size="12" class="ms-1" style="transform: translateX(3px)">
                        ChevronDown
                      </Icon>
                    </v-btn>
                  </template>
                </b-state>
              </div>
              <div class="col-4">
                <v-btn
                  v-tippy="'Open Steam store page'"
                  block
                  variant="tonal"
                  style="outline: rgb(108 122 145 / 40%) solid 1px"
                  @click="openDetails">
                  Open details
                </v-btn>
              </div>
            </div>
            <!-- </div> -->
            <!-- <div
              v-if="$next"
              style="
                position: absolute;
                right: -15px;
                bottom: -10px;
                z-index: 9999;
                background-color: rgb(55, 49, 49);
                cursor: pointer;
                padding: 15px 20px;
                color: white;
                box-shadow: black 2px 2px 0px 0px;
                display: flex;
                align-items: center;
              "
              @click="load($next)">
              <h4
                class="m-0"
                style="  font-weight: 500;
              margin-bottom: 8px;
              letter-spacing: normal;
              letter-spacing: 2px !important;
              text-transform: uppercase;
            }">
                Next
              </h4>
              <Icon size="18" width="2">ChevronRight</Icon>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="border-radius: 4px; margin-top: 5px">
      <v-list-item
        append-icon="mdi-chevron-right"
        lines="two"
        density="comfortable"
        class="text-decoration-none"
        link
        href="https://discord.gg/F2sPE5B"
        target="_blank">
        <!-- <template v-slot:prepend>
        <div class="p-2">
          <Icon size="18" width="1.5" class="text-muted">Flask</Icon>
        </div>
      </template> -->
        <template #title>
          <span class="text-body-2 px-1 font-serif">Game suggestions are a work in progress</span>
        </template>
        <template #subtitle>
          <small class="text-muted px-1">Share what you think and report bugs on Discord</small>
        </template>
        <!-- <template v-slot:append>
        <v-btn icon>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template> -->
      </v-list-item>
    </div>
  </v-dialog>
  <!-- <search-results ref="results" :filters="f" n@search:ready="search" @search:end="load">
    <template #body>
      <div></div>
    </template>
  </search-results> -->
</template>

<script>
/**
 * @file:    \components\game\RandomDialog.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 2nd January 2025
 * Modified: 14th October 2025 - 05:38:55
 **/

export default {
  name: 'RandomGameDialog',
  data: () => ({
    shown: [],

    f: {},
    filters: {
      string: '',
      source: 'all',
      sortBy: 'score',
      sortDir: 'desc',
      show: {
        page: 1,
        perPage: 1000,
      },
    },

    ui: {
      ping: 0,
      option: 0,
      show: false,
      loading: false,
      expandedDescription: false,
    },
  }),

  computed: {
    ...mapStores(useListStore, useGameStore, useSearchStore),
    ...mapState(useGameStore, ['app']),
    ...mapState(useRepositoryStore, {
      _genres: 'keyedGenres',
    }),

    genre() {
      if (!this.app.genres) return

      return this._genres[this.app.genres[0]]
    },

    genres() {
      if (!this.app.genres) return

      return this.app.genres
        .map((id) => (this._genres[id] ? this._genres[id].name : undefined))
        .filter(Boolean)
        .join(', ')

      return app.genres.map((id) => this._genres[id]?.name).join(', ')
    },
  },

  watch: {
    'ui.show': function (value) {
      this.reset()
    },
  },

  methods: {
    //+-------------------------------------------------
    // loadAndShow()
    // Initializes the dialog with event filters
    // -----
    // Created on Thu Jan 02 2025
    //+-------------------------------------------------
    loadAndShow() {
      this.loadARandomGame()

      this.shown = []
      this.ui.ping = 0
      this.ui.show = true
      this.ui.option = 0
    },

    //+-------------------------------------------------
    // loadARandomGame()
    // Gets the list of games from the search and loads a game
    // -----
    // Created on Mon Jan 06 2025
    //+-------------------------------------------------
    async loadARandomGame() {
      const items = this.searchStore.getSearchResults()
      this.ui.option = Math.floor(Math.random() * items.length)

      let selected = items[this.ui.option]

      while (this.shown.includes(selected)) {
        this.ui.option = Math.floor(Math.random() * items.length)
        selected = items[this.ui.option]
      }

      this.shown.push(selected)
      await this.gameStore.load(selected, {
        context: 'dialog',
        with: ['api'],
      })
    },

    openDetails() {
      this.$mitt.emit('game:dialog', {
        uuid: this.app.uuid,
      })

      this.ui.show = false
    },

    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
      }
    },
  },

  mounted() {
    this.$mitt.on('game:random', (payload) => {
      this.loadAndShow(payload)
    })

    // this.$mitt.on('state:changed', (payload) => {
    //   if (payload.uuid != this.app.uuid) return

    //   if (payload.state == 'fav') this.app.is.fav = payload.fav
    //   else this.app.state = payload.state

    //   this.$forceUpdate()
    // })
  },
}
</script>
