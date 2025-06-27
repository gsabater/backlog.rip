<template>
  <div class="card mb-3" style="padding: 0.5rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Preferences</h1>
        </div>
      </div>
      <p>
        Customize how content is shown across the site. Adjust pagination, result counts,
        and visual preferences to match your browsing style.
      </p>
    </div>
  </div>

  <div class="d-flex gap-2 mb-3">
    <v-btn
      :variant="ui.tab === 'general' ? 'tonal' : 'text'"
      color="deep-purple-lighten-4"
      @click="ui.tab = 'general'">
      Library management
    </v-btn>

    <v-btn
      :variant="ui.tab === 'accessibility' ? 'tonal' : 'text'"
      color="deep-purple-lighten-4"
      @click="ui.tab = 'accessibility'">
      Accesibility
    </v-btn>

    <v-btn
      :variant="ui.tab === 'developer' ? 'tonal' : 'text'"
      color="deep-purple-lighten-4"
      @click="ui.tab = 'developer'">
      Developer
    </v-btn>
  </div>

  <!--
    *+---------------------------------
    *| General
    *| Library management
    *+--------------------------------- -->
  <template v-if="ui.tab === 'general'">
    <div class="card mb-3">
      <div class="card-body">
        <h2 class="mb-2">Pagination settings</h2>
        <p class="card-subtitle">Choose how to navigate through your results</p>
        <!-- <div class="row align-items-center">
        <div class="col-auto"><span class="avatar avatar-xl" style="background-image: url(./static/avatars/000m.jpg)"></span>
        </div>
        <div class="col-auto"><a href="#" class="btn">
            Change avatar
          </a></div>
        <div class="col-auto"><a href="#" class="btn btn-ghost-danger">
            Delete avatar
          </a></div>
      </div> -->

        <!-- <h3 class="card-title mt-4">Your profile</h3> -->
        <div v-if="$auth.config.pagination" class="row g-3">
          <div class="col-md-6 nope-col-lg-8 mb-3">
            <div class="form-label font-serif">Pagination style</div>
            <v-select
              v-model="$auth.config.pagination.style"
              :items="[
                { title: 'Pages', value: 'pages' },
                { title: 'Load more button', value: 'loadMore' },
              ]"
              item-title="title"
              item-value="value"
              @update:model-value="setConfig('pagination')" />
            <!-- @change="update('username', $auth.me.username)" -->
          </div>

          <div class="col-6">
            <div class="form-label font-serif">Items per page</div>
            <v-select
              v-model="$auth.config.pagination.perPage"
              :items="[
                { title: '21 games (3 rows)', value: 21 },
                { title: '42 games (6 rows)', value: 42 },
                { title: '84 games (12 rows)', value: 84 },
                { title: '168 games (24 rows)', value: 168 },
              ]"
              item-title="title"
              item-value="value"
              @update:model-value="setConfig('pagination')" />
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <h2 class="mb-2">Library management</h2>
        <p class="card-subtitle">
          Settings available to tailor your categorization options
        </p>
        <div class="row g-3">
          <div class="col-md-12 nope-col-lg-8">
            <div class="mb-3">
              <div class="form-label pb-2">Special features</div>

              <label class="form-check form-switch cursor-pointer pb-2">
                <input
                  v-model="$auth.config.favorites"
                  type="checkbox"
                  class="form-check-input"
                  @change="setConfig('favorites')" />
                <span class="form-check-label">
                  <Icon size="14" width="1.5" style="transform: translateY(-2px)">
                    Heart
                  </Icon>
                  Favorites
                </span>

                <span class="form-check-description ps-1">
                  A special list for your favorite games. This list can be used to
                  generate suggestions.
                  <br />
                  Games added to favorites will be automatically included in your library.
                </span>

                <div class="form-check-description mt-2" style="vertical-align: top">
                  <Icon
                    size="14"
                    width="1.5"
                    class="tabler-icon tabler-icon-click me-1"
                    style="vertical-align: top">
                    LayersSelected
                  </Icon>
                  <div class="d-inline-block">
                    This enables a link in the sidebar and an option in the right click
                    menu
                  </div>
                </div>
              </label>

              <label class="form-check form-switch cursor-pointer pb-2">
                <input
                  v-model="$auth.config.pinned"
                  type="checkbox"
                  class="form-check-input"
                  @change="setConfig('pinned')" />
                <span class="form-check-label">
                  <Icon size="14" width="1.5" style="transform: translateY(-2px)">
                    Bookmark
                  </Icon>
                  Pinned games
                </span>
                <span class="form-check-description ps-1">
                  Allows you to quickly pin games for quick access, and shows a special
                  list with those games.
                  <br />
                  Pinned games will not be included in your library.
                </span>
                <div class="form-check-description mt-2" style="vertical-align: top">
                  <Icon
                    size="14"
                    width="1.5"
                    class="tabler-icon tabler-icon-click me-1"
                    style="vertical-align: top">
                    LayersSelected
                  </Icon>
                  <div class="d-inline-block">
                    This enables a link in the sidebar and an option in the right click
                    menu
                  </div>
                </div>
              </label>
              <label class="form-check form-switch cursor-pointer pb-2">
                <input
                  v-model="$auth.config.hidden"
                  type="checkbox"
                  class="form-check-input"
                  @change="setConfig('hidden')" />
                <span class="form-check-label">Hidden games</span>
                <span class="form-check-description ps-1">
                  Allows you to hide games from any source. Hidden games will be excluded
                  from any list or search.
                </span>

                <div class="form-check-description mt-2" style="vertical-align: top">
                  <Icon
                    size="14"
                    width="1.5"
                    class="tabler-icon tabler-icon-click me-1"
                    style="vertical-align: top">
                    LayersSelected
                  </Icon>
                  <div class="d-inline-block">
                    This enables an option in the right click menu
                  </div>
                </div>
              </label>
              <div class="form-check-description ms-1" style="vertical-align: top">
                <Icon
                  size="14"
                  width="1.5"
                  class="tabler-icon tabler-icon-click mt-1 me-2"
                  style="vertical-align: top">
                  Click
                </Icon>
                <div class="d-inline-block">
                  To change the states shown in the sidebar menu
                  <br />
                  go to the
                  <NuxtLink to="/account/states">states configuration page</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!--
    *+---------------------------------
    *| Accessibility
    *|
    *+--------------------------------- -->
  <div v-if="ui.tab === 'accessibility'" class="card mb-3">
    <div class="card-body">
      <h2 class="mb-2">Accessibility options</h2>
      <p class="card-subtitle">Preferences to customize your experience</p>

      <div class="row g-3">
        <div class="col-md-8">
          <div class="mb-3">
            <div class="form-label pb-2">Visual accessibility</div>

            <label class="form-check form-switch cursor-pointer pb-2">
              <input
                v-model="$auth.config.game_state_borders"
                type="checkbox"
                class="form-check-input"
                @change="setConfig('game_state_borders')" />
              <span class="form-check-label">Display state borders</span>
              <span class="form-check-description ps-1">
                Adds colored borders to game cards, visually indicating their current
                state. Those borders are more visible when the cursor is over the game.
              </span>
            </label>
          </div>
        </div>

        <div class="col"></div>

        <div
          class="row row-deck row-cards row-games-list col-md-3"
          style="display: flex; flex-direction: column; align-items: center">
          <b-game
            :data="{
              uuid: 'dummy',
              state: 3,
              steam_id: '1245620',
              name: 'Elden Ring',
            }"
            :disabled="true"
            style="max-width: 115px; transform: translateY(-25px)"></b-game>
        </div>
      </div>
    </div>
  </div>

  <!--
    *+---------------------------------
    *| Developer
    *|
    *+--------------------------------- -->
  <div v-if="ui.tab === 'developer'" class="card">
    <div class="card-body">
      <h2 class="mb-2">Developer options</h2>
      <p class="card-subtitle">Enable debugging and help us improve the platform</p>

      <!-- <div class="form-check form-switch form-switch-lg">
        <input
          v-model="$auth.config.debug"
          type="checkbox"
          class="form-check-input"
          @change="setConfig('debug')" />
        <span class="form-check-label form-check-label-on">Debugging enabled</span>
        <span class="form-check-label form-check-label-off">Developer mode is off</span>
      </div> -->

      <label class="form-check form-switch cursor-pointer form-switch-lg">
        <input
          v-model="$auth.config.debug"
          type="checkbox"
          class="form-check-input"
          @change="setConfig('debug')" />
        <span class="form-check-label form-label">
          <Icon size="16" width="1.2" style="transform: translateY(-2px)">Prompt</Icon>
          Developer mode
        </span>

        <span class="form-check-description ps-1">
          When enabled, the interface will show additional debugging information
          <br />
          and allow you to access features that might be under development.
        </span>
      </label>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\preferences.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 9th July 2024
 * Modified: Tue Jun 17 2025
 **/

export default {
  name: 'AccountPreferences',

  data() {
    return {
      ui: {
        tab: 'general',
      },
    }
  },

  methods: {
    //+-------------------------------------------------
    // setConfig()
    // Updates a field in the db via $auth
    // -----
    // Created on Mon Dec 18 2023
    //+-------------------------------------------------
    async setConfig(field) {
      this.$auth.setConfig(field)
      this.$toast.success('Your preferences have been updated')
    },
  },
}
</script>
