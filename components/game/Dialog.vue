<template>
  <Transition
    name="game-details"
    @before-leave="ui.isClosing = true"
    @after-leave="ui.isClosing = false">
    <div v-if="ui.dialog" id="game-details" @click="close">
      <div class="game-details__backdrop"></div>
      <div class="game-details__container">
        <game-folio :game="app" @close="close" />
      </div>
    </div>
  </Transition>
  <!-- <div>
    <canvas
      id="canvas"
      style="position: absolute; top: 0; left: 200px; z-index: 999"></canvas>
    <div
      id="colorDisplay"
      style="width: 100px; height: 100px; position: absolute; top: 0; z-index: 999"></div>
  </div> -->
  <VueFinalModal
    v-if="false"
    v-model="ui.dialog"
    class="game-details_modal"
    content-class="game-details-content game-card"
    overlay-transition="vfm-fade"
    :lock-scroll="false"
    :content-transition="{
      'enter-from-class': 'details-modal-out',
      'enter-to-class': 'hunaa-menu-full',
      'enter-active-class': 'hunaa-menu-enter-active',
      'leave-from-class': 'hunaa-menu-full',
      'leave-to-class': 'details-modal-out',
      'leave-active-class': 'hunaa-menu-leave-active',
    }">
    <div v-if="app" class="row w-100 h-100 g-0 m-0">
      <div
        class="d-md-flex col"
        style="
          max-width: 440px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        ">
        <div
          v-if="ui.layout == 'full'"
          style="max-width: 400px; max-height: 500px; z-index: 1; overflow: scroll">
          <pre>
          {{ app }}
        </pre
          >
        </div>

        <template v-else-if="app.id.steam">
          <game-asset
            ref="logo"
            :app="app"
            asset="logo"
            :priority="['steam']"
            style="
              max-width: 250px;
              z-index: 1;
              padding-bottom: 35px;
              filter: drop-shadow(2px 3px 9px black);
            "
            @click="ui.tab = 'details'"></game-asset>
          <div class="blur_back" style="">
            <game-asset
              ref="background"
              :app="app"
              asset="gen"
              :priority="['steam']"></game-asset>
          </div>
        </template>

        <div
          style="
            position: absolute;
            bottom: 0px;
            text-align: center;
            width: 100%;
            background: linear-gradient(0deg, #0000005c, transparent);
            padding: 10px 0;
          ">
          <small class="text-muted" style="font-size: 12px; display: block">
            <span
              v-tippy="
                `Added to database ${dates.timeAgo(app.created_at)} - ${$moment(app.created_at).format('L')}`
              ">
              Updated {{ $moment(app.updated_at * 1000).format('LL') }}
            </span>
            <br />
            Data provided by
            <img class="px-1" alt="" />
            and
            <span class="cursor-pointer">other sources (view)</span>
          </small>

          <div
            v-if="ui.layout == 'full'"
            style="background-color: #0000005c; margin: 5px; padding: 10px">
            <ul style="list-style-type: none">
              <li>Data from IGDB and Steam Store</li>
              <li>Metacritic score from metacritic.com</li>
              <li>Opencritic score from opencritic.com</li>
              <li>HowLongToBeat data from howlongtobeat.com</li>
            </ul>
          </div>
        </div>

        <div
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
        </div>
      </div>

      <!--
        *+---------------------------------
        *| Information column
        *+--------------------------------- -->
      <div class="col info_section">
        <template v-if="ui.tab == 'info'">
          <div class="info-header">
            <game-asset
              ref="cover"
              :app="app"
              asset="cover"
              class="locandina"
              :priority="['steam', 'igdb']"
              @click="ui.layout = ui.layout == 'full' ? 'lite' : 'full'"></game-asset>

            <h2>
              {{ app.name }}
            </h2>

            <BState :app="app.uuid" :state="app.state"></BState>

            <!--
            *+---------------------------------
            *| Playtime pill
            *| If this shit is repeated, make a component
            *+--------------------------------- -->
            <div v-if="app.is && app.is.lib">
              <div class="status small my-2" style="border-radius: 4px">
                <Icon size="14">ClockHour3</Icon>
                <span style="font-size: 0.775rem">
                  <template v-if="app._.playtime == 0">Not played</template>
                  <template v-else>
                    Played
                    <!-- <Icon class="mx-1" style="color: #666">ArrowRightRhombus</Icon> -->
                    {{ dates.minToHours(app._.playtime, 'Not played') }}
                    {{ dates.timeAgo(app.playtime.steam_last * 1000) }}
                  </template>
                </span>
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

          <p
            class="text mt-3 mb-2"
            :class="{ 'text-muted': !app.description }"
            style="
              text-align: justify;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            v-html="app.description || 'No description'"></p>

          <div v-if="app.genres.length || app.released_at" class="my-2">
            <h5>General details</h5>
            <ul>
              <li style="font-size: 13px">{{ listOfGenres(app) }}</li>
              <li
                v-if="app.released_at"
                v-tippy="dates.timeAgo(app.released_at)"
                style="font-size: 13px">
                <Icon>Calendar</Icon>
                First released on {{ app._.released_at }}
              </li>
            </ul>
          </div>

          <!--
          *+---------------------------------
          *| Scores block
          *|
          *+--------------------------------- -->
          <div v-if="app.score" class="my-2">
            <h5>Scores</h5>
            <div class="d-flex align-items-center">
              <div
                v-tippy="'Median score'"
                class="d-flex align-items-center text-muted small me-4">
                <Icon size="16" width="1.8" class="me-1">Universe</Icon>

                {{ app.score }}
              </div>

              <div
                v-if="app.scores.igdb"
                v-tippy="'Aggregate reviews from multiple sources'"
                class="d-flex align-items-center text-muted small me-3">
                <Icon size="16" width="1.8" class="me-1">Stack2</Icon>
                {{ app.scores.igdb }}%
                <!-- <br />
              <span>{{ app.scores.steamscore }}% of {{ app.scores.steamCount }}</span> -->
              </div>

              <!--
              *+---------------------------------
              *| Steam score
              *+---------------------------------
            -->
              <div
                v-if="app.scores.steamscoreAlt"
                v-tippy="'Reviews on Steam'"
                class="d-flex align-items-center text-muted small me-3">
                <Icon size="16" width="1.8" class="me-1">DiscountCheck</Icon>
                {{ app.scores.steamscore }}% · {{ app.scores.steamscoreAlt }}
                <!-- <br />
              <span>{{ app.scores.steamscore }}% of {{ app.scores.steamCount }}</span> -->
              </div>

              <!--
              *+---------------------------------
              *| Metacritic
              *+---------------------------------
            -->
              <div
                v-if="app.scores.metascore"
                class="d-flex align-items-center text-muted small me-3">
                <div
                  v-tippy="'Metacritic'"
                  class="text-muted"
                  style="
                    display: flex;
                    width: 23px;
                    height: 23px;
                    border-radius: 3px;
                    align-items: center;
                    justify-content: center;
                    color: black !important;
                  "
                  :style="{
                    'background-color': format.scoreToHuman(
                      app.scores.metascore,
                      'meta',
                      'color'
                    ),
                  }">
                  {{ app.scores.metascore }}
                </div>
              </div>

              <!--
              *+---------------------------------
              *| Metacritic
              *+---------------------------------
            -->
              <div
                v-if="app.scores.userscore"
                class="d-flex align-items-center text-muted small me-3">
                <div
                  v-tippy="'Metacritic users'"
                  class="text-muted"
                  style="
                    display: flex;
                    width: 23px;
                    height: 23px;
                    border-radius: 3px;
                    align-items: center;
                    justify-content: center;
                    color: black !important;
                  "
                  :style="{
                    'background-color': format.scoreToHuman(
                      app.scores.userscore,
                      'meta',
                      'color'
                    ),
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
                style="color: black">
                <img
                  :src="
                    'https://steam-backlog.com/images/' +
                    format.scoreToHuman(app.scores.oc, 'oc', 'label') +
                    '-head.png'
                  "
                  style="max-width: 20px; max-height: 20px; margin-right: 3px" />

                {{ app.scores.oc }}
              </div>
            </div>
          </div>

          <div v-if="app.hltb && app.hltb.main" class="my-2">
            <h5>Time to beat</h5>
            <small v-tippy="'Main game'" class="text-muted me-5">
              <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                SquareRoundedCheck
              </Icon>

              {{ dates.minToHours(app.hltb.main / 60) }}
            </small>
            <small v-tippy="'Main game with extras'" class="text-muted me-5">
              <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                DiscountCheck
              </Icon>
              {{ dates.minToHours(app.hltb.extras / 60) }}
            </small>
            <small v-if="app.hltb.comp" v-tippy="'Completionist'" class="text-muted me-5">
              <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                Trophy
              </Icon>
              {{ dates.minToHours(app.hltb.comp / 60) }}
            </small>

            <a
              v-tippy="hltbSource ? 'Click to open' : null"
              :href="hltbSource || null"
              :target="hltbSource ? '_blank' : null"
              class="text-muted"
              :class="{ disabled: !hltbSource }">
              <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                Click
              </Icon>
              From HLTB
            </a>
          </div>

          <div class="my-3">
            <div class="btn-list">
              <!-- <a
            v-tippy="'Open Steam store page'"
            :href="'https://store.steampowered.com/app/' + app.id.steam"
            class="btn btn-sm btn-icon"
            target="_blank">
            <Icon>BrandSteam</Icon>
            Steam page
          </a> -->

              <!-- <a
              v-tippy="'Open Steam store page'"
              :href="'https://store.steampowered.com/app/' + app.id.steam"
              class="btn btn-ghost-secondary btn-secondary btn-sm"
              target="_blank">
              <Icon size="15" class="me-2">BrandSteam</Icon>
              Steam page
            </a> -->

              <v-btn variant="tonal" size="small" class="me-2" color="blue-grey">
                <Icon size="15" class="me-2">BrandSteam</Icon>
                Steam page
              </v-btn>
              <div v-if="app.id.steam" class="btn-group btn-group-sm" role="group">
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
              </div>

              <a
                v-if="app.has_demo"
                v-tippy="'Play a free demo on Steam'"
                :href="'https://store.steampowered.com/app/' + app.id.steam"
                class="btn btn-ghost-secondary btn-secondary btn-sm"
                target="_blank">
                <Icon size="15" class="me-1">Download</Icon>
                Demo
              </a>

              <a
                v-if="app.id.xbox"
                v-tippy="'Open Xbox page'"
                :href="`https://www.xbox.com/games/store/${app.slug}/${app.id.xbox}`"
                class="btn btn-ghost-secondary btn-secondary btn-sm"
                target="_blank">
                <Icon size="15" class="me-1">BrandXbox</Icon>
                Xbox store
              </a>

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

          <div class="my-2">
            <small v-if="app.is.lib" class="text-muted" :title="app.is.lib">
              <Icon
                v-tippy="'In Backlog.rip since ' + $moment(app.created_at).format('LL')"
                size="16"
                style="transform: translateY(-2px)"
                class="me-1">
                Calendar
              </Icon>
              In your library since {{ app.is.lib }} -

              {{ $moment(app.is.lib).format('LL') }}
            </small>
          </div>
        </template>

        <template v-if="ui.tab == 'details'">
          <div class="row g-3">
            <div class="col-12 m-0" @click="ui.tab = 'info'">
              <h2 class="m-0">{{ app.name }} details</h2>
            </div>
            <div class="col-6">
              <div class="datagrid-title">Registrar</div>
              <div class="datagrid-content">Third Party</div>
            </div>
            <div class="col-6">
              <div class="datagrid-title">Port number</div>
              <div class="datagrid-content">3306</div>
            </div>

            <div class="col-6">
              <div class="datagrid-title">Registrar</div>
              <div class="datagrid-content">Third Party</div>
            </div>
            <div class="col-6">
              <div class="datagrid-title">Port number</div>
              <div class="datagrid-content">3306</div>
            </div>
          </div>
        </template>

        <div
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
        </div>
      </div>
    </div>

    <!-- <div class="modal-back"></div> -->
    <div v-if="false" class="info_section row">
      <div class="row row-deck row-cards m-0">
        <div v-if="app.score" class="col col-md-3">
          <div class="card">
            <div class="card-body" style="padding: 0.5rem 0.75rem">
              <div class="d-flex align-items-center">
                <div class="subheader">Median score</div>

                <!-- <div class="ms-auto">
                  <tippy class="text-muted ms-auto cursor-help" :content="'xxx'">
                    <Icon>HelpCircleFilled</Icon>
                  </tippy>
                </div> -->
              </div>
              <div class="h1 mt-2 mb-0">
                {{ app.score }}
                <span class="subheader">/100</span>
                <!-- <br />
                <span class="subheader">Overwhelmingly positive</span> -->
              </div>

              <!-- <div class="progress progress-sm" style="background-color: #25384f">
                <div class="progress-bar bg-primary" :style="`width: ${app.score}%`">
                  <span class="visually-hidden">{{ app.score }}% Complete</span>
                </div>
              </div> -->
              <!-- <div class="d-flex mb-2">
                <div class="subheader">125.000 votes on Steam</div>
              </div> -->
            </div>
          </div>
        </div>

        <div v-if="app.scores.steamscore" class="col col-md-3">
          <div class="card" style="border: 2px solid rgb(102, 192, 244)">
            <div class="card-body" style="padding: 0.5rem 0.75rem">
              <div class="d-flex align-items-center">
                <div class="subheader">Steam reviews</div>

                <!-- <div class="ms-auto">{{ app.scores.steamCount }} reviews on steam</div> -->
              </div>
              <div class="h1 mt-2 mb-0">
                {{ app.scores.steamscore }}
                <span class="subheader">/100</span>
                <span class="d-block subheader">
                  {{ app.scores.steamscoreAlt }}
                </span>
              </div>

              <!-- <div class="progress progress-sm" style="background-color: #25384f">
                <div class="progress-bar bg-primary" :style="`width: ${app.score}%`">
                  <span class="visually-hidden">{{ app.score }}% Complete</span>
                </div>
              </div> -->
              <!-- <div class="d-flex mb-2">
                <div class="subheader">125.000 votes on Steam</div>
              </div> -->
            </div>
          </div>
        </div>

        <div v-if="false && app.scores.metascore" class="col col-md-3">
          <div class="card" style="border: 2px solid rgb(84, 167, 43)">
            <div class="card-body" style="padding: 0.5rem 0.75rem">
              <div class="d-flex align-items-center">
                <div class="subheader">Metacritic reviews</div>
              </div>
              <div class="h1 mb-0">
                {{ app.scores.metascore }}
                <span class="subheader">/100</span>
                <!-- <br />
                <span class="subheader">Overwhelmingly positive</span> -->
              </div>

              <!-- <div class="progress progress-sm" style="background-color: #25384f">
                <div class="progress-bar bg-primary" :style="`width: ${app.score}%`">
                  <span class="visually-hidden">{{ app.score }}% Complete</span>
                </div>
              </div> -->
              <!-- <div class="d-flex mb-2">
                <div class="subheader">125.000 votes on Steam</div>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- <div>95 /100 Median score</div>

      <div>93 /100 Overwhelmingly positive Steam score 125.000 votes view on steam</div> -->

      <div v-if="ui.layout == 'full'" class="col col-md-3">
        You played: {{ app._playtime }} last played: {{ app._last_played }}
        <br />
      </div>

      <!-- <div v-if="$app.dev" class="col col-md-3">
        owned: {{ app.is.owned }}
        <div v-tippy="'View history log of changes'"><Icon>Paper</Icon></div>
      </div> -->
    </div>
    <!-- <div class="blur_back">
      <game-asset
        ref="background"
        :app="app"
        asset="background"
        :priority="['steam']"></game-asset>
    </div> -->
  </VueFinalModal>
</template>

<script>
/**
 * @file:    \components\b\details.vue
 * @desc:    ... https://davidwalsh.name/detect-sticky
 * -------------------------------------------
 * Created Date: 1st December 2023
 * Modified: Mon 16 December 2024 - 17:03:28
 **/

export default {
  name: 'GameDetailsDialog',
  data() {
    return {
      $list: null,
      timeline: [],

      status: {
        note: '',
        noteObject: null,
        needs_update: false,
      },

      ui: {
        tab: 'info',
        path: null,
        layout: 'lite', // full
        dialog: false,
        loading: false,
        isClosing: false,
        showTitle: true,
      },
    }
  },

  computed: {
    ...mapStores(useGameStore, useJournalStore),
    // ...mapState(useDataStore, ['app']),
    ...mapState(useGameStore, ['app']),
    ...mapState(useRepositoryStore, {
      _genres: 'keyedGenres',
    }),

    $prev() {
      if (!this.app || !this.$data.$list || !this.$data.$list.items) return

      const index = this.$data.$list.items.indexOf(this.app.uuid)
      return this.$data.$list.items[index - 1]
    },

    $next() {
      if (!this.app || !this.$data.$list || !this.$data.$list.items) return

      let index = null
      const uuid = this.app.uuid
      const list = this.$data.$list.items

      // Check if the list contains objects with a uuid property
      if (typeof list[0] === 'object' && 'uuid' in list[0]) {
        index = list.findIndex((item) => item.uuid === uuid)
      } else if (typeof list[0] === 'string') {
        index = list.indexOf(uuid)
      }

      return this.$data.$list.items[index + 1]
    },

    hltbSource() {
      if (!this.app?.source?.providers?.hltb) return false

      return 'https://howlongtobeat.com/game/' + this.app.source.providers.hltb
    },

    screenshots() {
      if (!this.app?.screenshots) return []

      return this.app.screenshots.data.map((hash, i) => ({
        id: i,
        width: 1920,
        height: 1080,

        src: this.app.screenshots.base + hash + this.app.screenshots.full,
        full: this.app.screenshots.base + hash + this.app.screenshots.full,
        thumb: this.app.screenshots.base + hash + this.app.screenshots.thumb,
      }))
    },

    myState() {
      return (
        this.$refs?.bstate?.st || {
          name: null,
          color: null,
        }
      )
    },
  },

  methods: {
    async show() {
      this.ui.dialog = true
      this.ui.layout = 'full'
      this.ui.showTitle = true
    },

    //+-------------------------------------------------
    // load()
    // Receives an uuid or object and tries to load the game
    // -----
    // Created on Tue Jul 23 2024
    //+-------------------------------------------------
    load(app) {
      let uuid = null
      if (typeof app === 'string') uuid = app
      else if (typeof app === 'object') uuid = app.uuid

      this.gameStore.load(uuid)
    },

    //+-------------------------------------------------
    // loadAndShow()
    // Loads a game and shows the modal
    // -----
    // Created on Fri Apr 05 2024
    // Updated on Mon Nov 25 2024 - Added URL replacement
    //+-------------------------------------------------
    async loadAndShow(payload) {
      this.$list = payload.$list
      this.load(payload.uuid)
      this.show()

      this.$nextTick(() => {
        if (this.app?.slug) {
          this.ui.path = window.location.pathname

          // Update URL without navigation using History API
          const newUrl = `/game/${this.app.slug}`
          window.history.pushState({ path: newUrl }, '', newUrl)

          // Add back button listener
          window.addEventListener('popstate', this.handlePopState)
        }
      })

      // const timeline = await this.journalStore.getForRef(app)

      // this.app = { ...data }
      // this.timeline = { ...timeline }

      // const note = await this.journalStore.getNoteForRef(app)
      // this.status.noteObject = note || null
      // this.status.note = note?.data.note || ''

      // // console.warn(app, this.app, timeline)

      // this.evaluate()
    },

    //+-------------------------------------------------
    // listOfGenres()
    // Helper method to get the list of genre names for the current app
    // NOTE: Should be moved to a store
    // -----
    // Created on Fri Apr 05 2024
    //+-------------------------------------------------
    listOfGenres(app) {
      if (!app.genres) return

      return app.genres
        .map((id) => (this._genres[id] ? this._genres[id].name : undefined))
        .filter(Boolean)
        .join(', ')

      return app.genres.map((id) => this._genres[id]?.name).join(', ')
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Wed Nov 13 2024
    //+-------------------------------------------------
    // getCoverColor() {
    //   const img = document.getElementById('sourceImage')
    //   const canvas = document.getElementById('canvas')
    //   const ctx = canvas.getContext('2d')
    //   img.onload = function () {
    //     canvas.width = img.naturalWidth
    //     canvas.height = img.naturalHeight
    //     ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    //     try {
    //       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    //       const data = imageData.data

    //       let r = 0,
    //         g = 0,
    //         b = 0
    //       const pixelCount = data.length / 4

    //       for (let i = 0; i < data.length; i += 4) {
    //         r += data[i]
    //         g += data[i + 1]
    //         b += data[i + 2]
    //       }

    //       r = Math.floor(r / pixelCount)
    //       g = Math.floor(g / pixelCount)
    //       b = Math.floor(b / pixelCount)

    //       let color = `rgb(${r}, ${g}, ${b})`

    //       // Ensure the color is dark enough
    //       const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    //       if (luminance > 128) {
    //         r = Math.floor(r * 0.5)
    //         g = Math.floor(g * 0.5)
    //         b = Math.floor(b * 0.5)
    //         color = `rgb(${r}, ${g}, ${b})`
    //       }

    //       document.getElementById('colorDisplay').style.backgroundColor = color
    //     } catch (e) {
    //       console.warn('Could not get the color', e)
    //     }
    //   }
    // },

    //+-------------------------------------------------
    // setNote()
    // update or create a note for the current app
    // TODO: if note is empty, delete note
    // -----
    // Created on Tue Dec 26 2023
    //+-------------------------------------------------
    setNote() {
      if (!this.status.note) return

      this.journalStore.updateOrCreateNote(this.app.uuid, this.status.note)
      this.$toast.success('Note saved for ' + this.app.name, {
        description: 'Monday, January 3rd at 6:00pm',
      })
    },

    //+-------------------------------------------------
    // close()
    // Restores the URL, closes the dialog and removes the events
    // -----
    // Created on Mon Nov 25 2024
    //+-------------------------------------------------
    close() {
      this.restoreUrl()
      window.removeEventListener('popstate', this.handlePopState)

      // Just toggle the dialog, transition handles the animation
      this.ui.dialog = false
    },

    restoreUrl() {
      if (this.ui.path) {
        window.history.replaceState({ path: this.ui.path }, '', this.ui.path)
        this.ui.path = null
      }
    },

    handlePopState(event) {
      event?.preventDefault() // Prevent actual back navigation
      this.close() // Close dialog when back button is pressed
    },
  },

  mounted() {
    this.$mitt.on('game:modal', this.loadAndShow)
  },

  beforeUnmount() {
    this.$mitt.off('game:modal', this.loadAndShow)
    window.removeEventListener('popstate', this.handlePopState)
  },
}
</script>

<style>
img.pswp__img {
  /* max-width: 95vw; */
  /* max-height: 95vh; */
  /* margin: auto; */
  padding: 5vw;
}
</style>
