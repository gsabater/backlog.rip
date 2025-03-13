<template>
  <template v-if="app && app.uuid">
    <div class="row my-2 align-items-center">
      <div class="col-6">
        <h5 class="m-0">Your achievements</h5>
      </div>
      <div class="col-auto ms-auto">
        <small
          class="text-muted"
          v-tippy="'Achievements are synced with Steam once every 24 hours'">
          <Icon class="text-muted me-1" size="14" width="1.4">Refresh</Icon>

          Synchronized
          {{ dates.timeAgo(app.dates.achievements) }}
        </small>
        <!-- <pre>{{ app }}</pre> -->
        <!-- <v-btn variant="text" ncolor="blue-grey-lighten-1" size="small" @click="reloadAchievements">
          Sync my achievements

        </v-btn> -->
      </div>
    </div>

    <div class="row row-cards row-deck mb-4" style="--tblr-gutter-x: 1.1rem">
      <div class="col-sm-6 col-lg-3">
        <div class="card card-sm" style="max-height: 75px">
          <div class="card-body">
            <h3 class="m-0">
              <Icon
                size="15"
                width="1.5"
                style="transform: translateY(-1px)"
                class="me-1">
                SquareRoundedCheck
              </Icon>
              {{ astats.completed }} / {{ astats.total }}
              <small
                class="cursor-help"
                v-if="hiddenAchievements.length"
                v-tippy="
                  hiddenAchievements.length +
                  ' achievements are hidden or marked as bugged. Achievements count is adjusted accordingly'
                ">
                ˟
              </small>
            </h3>
            <small class="text-secondary">Achievements earned</small>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-lg-3">
        <div class="card card-sm" style="max-height: 75px">
          <div class="card-body">
            <h3 class="m-0">
              <Icon
                size="15"
                width="1.5"
                style="transform: translateY(-1px)"
                class="me-1">
                DiscountCheck
              </Icon>
              {{ astats.percentage }}%
            </h3>
            <small class="text-secondary">Completion rate</small>
          </div>
        </div>
      </div>

      <div v-if="latest" class="col-sm-6">
        <div class="card card-sm" style="max-height: 75px; aspect-ratio: unset">
          <div
            class="card-body row"
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
            ">
            <div class="col-auto">
              <span class="avatar avatar-3">
                <img
                  :src="latest.icon"
                  style="
                    outline: 1px solid rgba(255, 255, 255, 0.15);
                    outline-offset: -1px;
                    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.36);
                    border-radius: 1px;
                  " />
              </span>
            </div>
            <div class="col">
              <span class="font-serif text-bold" style="color: rgb(58, 64, 73)">
                {{ latest.name }}
              </span>
              <br />
              <small class="font-serif text-muted">
                Latest achievement, unlocked {{ dates.timeAgo(latest.is.time * 1000) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-if="focusedAchievements.length">
      <div class="row my-2 align-items-center">
        <div class="col-6">
          <h5 class="m-0">Prioritized</h5>
        </div>
      </div>

      <div style="position: relative">
        <v-btn
          id="swiper-prev"
          size="small"
          class="text-muted"
          icon
          variant="text"
          style="position: absolute; top: 17px; left: -32px; z-index: 9999">
          <Icon size="24">ChevronLeft</Icon>
        </v-btn>
        <v-btn
          id="swiper-next"
          size="small"
          class="text-muted"
          icon
          variant="text"
          style="position: absolute; top: 17px; right: -32px; z-index: 9999">
          <Icon size="24">ChevronRight</Icon>
        </v-btn>

        <swiper
          :loop="focusedAchievements.length > 2"
          :grab-cursor="true"
          :slides-per-view="2"
          :space-between="20"
          :navigation="{
            nextEl: '#swiper-next',
            prevEl: '#swiper-prev',
          }"
          npagination="{ type: 'fraction' }"
          :modules="$swiperModules"
          class="row-cards mb-4">
          <swiper-slide
            v-for="achievement in focusedAchievements"
            :key="achievement.uuid">
            <div class="card card-sm" style="max-height: 75px; aspect-ratio: unset">
              <div
                class="card-body row"
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: flex-start;
                ">
                <div class="col-auto">
                  <span class="avatar avatar-3">
                    <img
                      :src="achievement.icon"
                      style="
                        outline: 1px solid rgba(255, 255, 255, 0.15);
                        outline-offset: -1px;
                        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.36);
                        border-radius: 1px;
                      " />
                  </span>
                </div>
                <div class="col">
                  <span class="font-serif text-bold" style="color: rgb(58, 64, 73)">
                    {{ achievement.name }}
                  </span>
                  <!-- <br />
                  <small
                    class="font-serif text-muted"
                    >
                    {{ achievement.description }}
                  </small> -->
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </template>

    <div class="row my-2 align-items-center">
      <div class="col-6">
        <h5 class="m-0">All achievements</h5>
      </div>
      <div class="col col-auto ms-auto text-right">
        <v-btn id="resources" variant="tonal" ncolor="blue-grey-lighten-1" size="small">
          Resources

          <Icon
            class="text-muted"
            size="14"
            width="2"
            style="transform: translate(5px, 1px)">
            ChevronDown
          </Icon>
        </v-btn>
        <b-dropdown
          to="#resources"
          trigger="mouseenter focus click hover manual"
          placement="bottom-start"
          :debounce="150"
          style="min-width: 200px">
          <a
            class="dropdown-item"
            :href="`https://steamcommunity.com/app/${app.id.steam}/guides/`"
            target="_blank">
            <b-logo
              name="steam"
              size="12"
              class="me-2"
              color="white"
              style="transform: translateY(1px); opacity: 0.6" />
            <span class="pe-2">Guides on Steam</span>
            <Icon width="1" size="11" class="ms-auto">ExternalLink</Icon>
          </a>
          <a
            class="dropdown-item"
            :href="`https://steamcommunity.com/stats/${app.id.steam}/achievements`"
            target="_blank">
            <b-logo
              name="steam"
              size="12"
              class="me-2"
              color="white"
              style="transform: translateY(1px); opacity: 0.6" />
            <span class="pe-2">Achievements on Steam</span>
            <Icon width="1" size="11" class="ms-auto">ExternalLink</Icon>
          </a>
        </b-dropdown>
      </div>
    </div>

    <!--
      *+---------------------------------
      *| Achievements
      *+--------------------------------- -->
    <div
      class="card mb-3"
      v-if="app.achievements && app.achievements.length"
      style="border-color: #adb3bb">
      <div class="list-group card-list-group achievements-list">
        <template v-for="achievement in visibleAchievements" :key="achievement.uuid">
          <div
            class="list-group-item px-3 cursor-pointer text-decoration-none"
            style="padding-top: 0.8rem; padding-bottom: 0.8rem">
            <div class="row gx-3 align-items-center">
              <div class="col-auto">
                <span class="avatar avatar-2">
                  <img
                    :src="achievement.icon"
                    style="
                      outline: 1px solid rgba(255, 255, 255, 0.15);
                      outline-offset: -1px;
                      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.36);
                      border-radius: 1px;
                    " />
                </span>
              </div>
              <div class="col">
                <span class="font-serif text-bold">{{ achievement.name }}</span>
                <div class="v-list-item-subtitle">
                  <small>
                    {{ achievement.description }}
                  </small>
                </div>
              </div>

              <div v-if="achievement.is" class="col-auto px-2">
                <template v-if="achievement.is.status == 'unlocked'">
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      background: green;
                      border-radius: 50px;
                      box-shadow: 1px 1px 0px #026302;
                      max-height: 40px;
                    ">
                    <div
                      style="
                        width: 40px;
                        height: 40px;
                        background: #ffffff1f;
                        border-radius: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                      ">
                      <Icon size="20" width="1.4">Trophy</Icon>
                    </div>
                    <div
                      class="mx-2 pe-2"
                      style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-size: 0.8rem;
                        color: white;
                        font-weight: 300;
                      ">
                      <small>Achievement {{ achievement.is.status }}</small>
                      <small style="font-weight: 500">
                        {{
                          dates.unixToDate(achievement.is.time || achievement.is.steam)
                        }}
                      </small>
                    </div>
                  </div>
                </template>
                <template v-if="achievement.is.status == 'focused'">
                  <div class="d-flex flex-column small text-right">
                    <strong v-if="achievement.is.status == 'focused'">
                      Achievement prioritized
                    </strong>
                    <strong v-else>Achievement set as {{ achievement.is.status }}</strong>
                    <em class="d-block small">
                      {{ dates.timeAgo(achievement.is.time * 1000) }}
                    </em>
                  </div>
                </template>
              </div>

              <div
                v-else-if="achievement.completion"
                class="col-auto small"
                v-tippy="'Completed by ' + achievement.completion + '% of players'">
                <v-btn variant="tonal" size="x-small" color="blue-grey-lighten-1">
                  {{ achievement.completion }}%
                </v-btn>
              </div>

              <div class="col-auto" @click.prevent="() => {}">
                <div style="position: relative">
                  <v-btn
                    variant="text"
                    icon="mdi-chevron-right"
                    size="x-small"
                    color="grey-darken-1">
                    <Icon size="14" width="1.5">DotsVertical</Icon>
                  </v-btn>
                  <b-dropdown
                    trigger="mouseenter focus click hover manual"
                    placement="bottom-end"
                    :debounce="150"
                    style="min-width: 180px">
                    <div class="dropdown-header">{{ achievement.name }}</div>

                    <div
                      v-if="!achievement.is || achievement.is.status !== 'unlocked'"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'unlocked')">
                      ✅ Mark as unlocked
                    </div>

                    <div
                      v-if="achievement.is && achievement.is.time"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'clear')">
                      <Icon size="16" class="me-2 text-muted">ArrowBack</Icon>
                      Clear state
                    </div>

                    <div class="dropdown-divider"></div>
                    <div
                      v-if="!achievement.is || achievement.is.status !== 'focused'"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'focused')">
                      <Icon size="16" class="me-2 text-muted">ChevronsUp</Icon>
                      Prioritize
                    </div>

                    <div
                      v-if="!achievement.is || achievement.is.status !== 'abandoned'"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'abandoned')">
                      <Icon size="16" class="me-2 text-muted">X</Icon>
                      Abandon
                    </div>

                    <div
                      v-if="!achievement.is || achievement.is.status !== 'bugged'"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'bugged')">
                      <Icon size="16" class="me-2 text-muted">Bug</Icon>
                      Mark as bugged
                    </div>

                    <div class="dropdown-divider"></div>
                    <div v-if="achievement.completion" class="dropdown-item disabled">
                      <small>
                        Earned by the
                        <code>{{ achievement.completion }}%</code>
                        of players
                      </small>
                      <!-- <br />
                                Achievement ID
                                <code>#{{ achievement.steam_key }}</code> -->
                    </div>
                  </b-dropdown>
                </div>
              </div>

              <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="my-1">
      <v-divider v-if="hiddenAchievements.length" class="" style="border-style: dashed">
        <v-btn size="small" variant="text" @click="ui.showHidden = !ui.showHidden">
          {{ hiddenAchievements.length }} achievements hidden
          <Icon size="14" width="1.5" class="ms-1 text-muted">ChevronDown</Icon>
        </v-btn>
      </v-divider>
    </div>

    <div
      class="card mb-3"
      v-if="hiddenAchievements.length && ui.showHidden"
      style="border-color: #adb3bb">
      <div class="list-group card-list-group achievements-list">
        <template v-for="achievement in hiddenAchievements" :key="achievement.uuid">
          <div
            class="list-group-item px-3 cursor-pointer text-decoration-none"
            style="padding-top: 0.8rem; padding-bottom: 0.8rem">
            <div class="row gx-3 align-items-center">
              <div v-if="achievement.is" class="col-auto">
                <span class="badge bg-red"></span>
              </div>

              <div class="col-auto">
                <span class="avatar avatar-2">
                  <img
                    :src="achievement.icon"
                    style="
                      outline: 1px solid rgba(255, 255, 255, 0.15);
                      outline-offset: -1px;
                      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.36);
                      border-radius: 1px;
                    " />
                </span>
              </div>
              <div class="col">
                <span class="font-serif text-bold">{{ achievement.name }}</span>
                <div class="v-list-item-subtitle">
                  <small>
                    {{ achievement.description }}
                  </small>
                </div>
              </div>

              <div v-if="achievement.is" class="col-auto px-2 text-right">
                <div class="d-flex flex-column small">
                  <strong>Achievement set as {{ achievement.is.status }}</strong>
                  <em class="d-block small">
                    {{ dates.timeAgo(achievement.is.time * 1000) }}
                  </em>
                </div>
              </div>

              <div class="col-auto" @click.prevent="() => {}">
                <div style="position: relative">
                  <v-btn
                    variant="text"
                    icon="mdi-chevron-right"
                    size="x-small"
                    color="grey-darken-1">
                    <Icon size="14" width="1.5">DotsVertical</Icon>
                  </v-btn>
                  <b-dropdown
                    trigger="mouseenter focus click hover manual"
                    placement="bottom-end"
                    :debounce="150"
                    style="min-width: 180px">
                    <div class="dropdown-header">{{ achievement.name }}</div>
                    <div
                      v-if="!achievement.is || achievement.is.status !== 'unlocked'"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'unlocked')">
                      ✅ Mark as unlocked
                    </div>

                    <div
                      v-if="achievement.is && achievement.is.time"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'clear')">
                      <Icon size="16" class="me-2 text-muted">ArrowBack</Icon>
                      Clear state
                    </div>

                    <div class="dropdown-divider"></div>

                    <div
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'focused')">
                      <Icon size="16" class="me-2 text-muted">ChevronsUp</Icon>
                      Prioritize
                    </div>

                    <div
                      v-if="!achievement.is || achievement.is.status !== 'abandoned'"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'abandoned')">
                      <Icon size="16" class="me-2 text-muted">X</Icon>
                      Abandon
                    </div>

                    <div
                      v-if="!achievement.is || achievement.is.status !== 'bugged'"
                      class="dropdown-item"
                      @click.stop="setAchAs(achievement.steam_key, 'bugged')">
                      <Icon size="16" class="me-2 text-muted">Bug</Icon>
                      Mark as bugged
                    </div>
                  </b-dropdown>
                </div>
              </div>

              <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
</template>

<script>
/**
 * @file:    \components\game\TabAchievements.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 3rd March 2025
 * Modified: Thu 13 March 2025 - 17:21:05
 **/

export default {
  name: 'GameTabAchievements',

  data() {
    return {
      ui: {
        showHidden: false,
      },
    }
  },

  computed: {
    ...mapStores(useGameStore),
    ...mapState(useGameStore, ['app']),

    astats() {
      return this.app._.astats || {}
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri Feb 21 2025
    //+-------------------------------------------------
    achievements() {
      if (!this.app?.achievements?.length) return false

      return this.app.achievements.sort(
        (a, b) => parseFloat(b.completion) - parseFloat(a.completion)
      )
    },

    visibleAchievements() {
      if (!this.app?.achievements?.length) return false

      return this.achievements.filter(
        (a) => !a.is?.status || a.is.status == 'unlocked' || a.is.status == 'focused'
      )
    },

    //+-------------------------------------------------
    // hiddenAchievements()
    // Returns an array of hidden achievements
    // -----
    // Created on Thu Mar 06 2025
    //+-------------------------------------------------
    hiddenAchievements() {
      if (!this.app?.achievements?.length) return false

      return this.achievements.filter(
        (a) => a.is?.status == 'abandoned' || a.is?.status == 'bugged'
      )
    },

    //+-------------------------------------------------
    // focusedAchievements()
    // Returns an array of focused achievements to use with Swiper
    // -----
    // Created on Thu Mar 06 2025
    //+-------------------------------------------------
    focusedAchievements() {
      if (!this.app?.achievements?.length) return false
      return this.achievements.filter((a) => a.is?.status == 'focused')
    },

    //+-------------------------------------------------
    // latest()
    // Returns the latest achievement from astats
    // -----
    // Created on Wed Mar 05 2025
    //+-------------------------------------------------
    latest() {
      if (!this.astats?.latest) return false
      if (!this.app?.achievements?.length) return false

      return this.app.achievements.find((a) => a.steam_key == this.astats.latest)
    },
  },

  methods: {
    //+-------------------------------------------------
    // setAchAs()
    // Sets or clears the state of an achievement
    // -----
    // Created on Sun Mar 02 2025
    //+-------------------------------------------------
    setAchAs(achKey, status) {
      let ach = this.app.achievements.find((a) => a.steam_key == achKey)
      if (status == 'clear') delete ach.is
      else {
        ach.is = ach.is || {}
        ach.is.status = status
        ach.is.time = dates.stamp()
      }

      this.gameStore.update(this.app.uuid, { achievements: this.app.achievements })
    },

    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
