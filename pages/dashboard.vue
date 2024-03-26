<template>
  <!-- Page header -->
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <div class="page-header">
            <h1 class="page-title">Dashboard</h1>
            <p class="text-muted">Find games, apps, and more...</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Page body -->
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="row g-2 align-items-center">
                <div class="col-auto">
                  <span
                    class="avatar avatar-lg"
                    :style="`background-image: url(${$auth.user.avatar})`"></span>
                </div>
                <div class="col">
                  <h4 class="card-title m-0">
                    <a href="#">{{ $auth.user.username }}</a>
                  </h4>
                  <div class="subheader">Steam library</div>
                  <div class="h3 m-0">
                    Last sync, {{ dates.timeAgo($auth.user.steam_updated_at) }}
                  </div>
                  <!-- <div class="text-muted">Working in Kare</div> -->
                </div>
                <!-- <div class="col-auto">
                  <a href="#" class="btn">Subscribe</a>
                </div> -->
                <!-- <div class="col-auto">
                  <div class="dropdown">
                    <a
                      href="#"
                      class="btn-action"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                      </svg>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                      <a href="#" class="dropdown-item">Import</a>
                      <a href="#" class="dropdown-item">Export</a>
                      <a href="#" class="dropdown-item">Download</a>
                      <a href="#" class="dropdown-item text-danger">Delete</a>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <div v-if="db.recent.length" class="col-12">
          <h2 class="pb-0 mb-0">Currently playing</h2>
          <gameList :apps="playing" cols="3" class="pt-3"></gameList>
        </div>

        <div v-if="db.recent.length" class="col-12">
          <h2 class="pb-0 mb-0">Latest games in your library</h2>
          <gameList :apps="db.recent" cols="3" class="pt-3"></gameList>
        </div>

        <div v-if="false && $app.dev" class="col-12">
          <div class="card">
            <div class="card-body">
              <p class="mb-3">Games and backlog breakdown</p>
              <div class="progress progress-separated mb-3">
                <div
                  v-for="(state, i) in states"
                  v-tippy="state.name"
                  class="progress-bar"
                  :style="'background-color:' + state.color"
                  role="progressbar"
                  style="width: 44%"
                  aria-label="Regular"></div>
                <!-- <div
                  class="progress-bar bg-info"
                  role="progressbar"
                  style="width: 19%"
                  aria-label="System"></div>
                <div
                  class="progress-bar bg-success"
                  role="progressbar"
                  style="width: 9%"
                  aria-label="Shared"></div> -->
              </div>
              <div class="row">
                <!-- <div class="col-auto d-flex align-items-center pe-2">
                  <span class="legend me-2 bg-primary"></span>
                  <span>Unplayed</span>
                  <span
                    class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary">
                    915MB
                  </span>
                </div>
                <div class="col-auto d-flex align-items-center px-2">
                  <span class="legend me-2 bg-info"></span>
                  <span>Played games</span>
                  <span
                    class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary">
                    415MB
                  </span>
                </div>
                <div class="col-auto d-flex align-items-center px-2">
                  <span class="legend me-2 bg-success"></span>
                  <span>Shared</span>
                  <span
                    class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary">
                    201MB
                  </span>
                </div> -->

                <div
                  v-for="(state, i) in states"
                  class="col-auto d-flex align-items-center ps-2">
                  <span
                    class="legend me-2"
                    :style="'background-color:' + state.color"></span>
                  <span>{{ state.name }}</span>
                  <span
                    class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary">
                    5
                  </span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto">
                  <div class="btn btn-sm btn-secondary">View all</div>
                </div>
                <div class="col-12">
                  <gameList
                    v-if="latest.length"
                    :apps="latest"
                    cols="3"
                    class="pt-3"></gameList>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\dashboard.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Sat Mar 16 2024
 **/

export default {
  setup() {},

  data() {
    return {
      db: {
        recent: [],
      },

      ui: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),
    // ...mapState(useDataStore, ['recentlyAdded']),
    ...mapState(useStateStore, {
      states: 'list',
      playing: 'playing',
    }),

    latest() {
      // return this.latestGames.map((item) => item.uuid)
      return []
    },
  },

  watch: {
    '$app.ready': function () {
      this.init()
    },
  },

  methods: {
    async getData() {
      this.db.recent = this.dataStore.getRecentlyAdded(7)
      this.db.playing = this.playing
    },

    init() {
      if (!this.$app.ready) return

      this.getData()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
