<template>
  <div class="card card-game">
    <div class="poster">
      <img :src="poster" :alt="app.steam_id" @error="iPoster++" />
    </div>
    <div class="card-body">
      <div class="h5">
        {{ app.name }}
      </div>
      <div class="text-muted">
        {{ app.steam_id }}
        <pre>{{ app.state || 'N' }}</pre>

        <b-state :app="app.uuid" @set="setState">
          <button type="button" class="btn">
            <Icon size="18" class="text-muted me-1">Dots</Icon>
          </button>
        </b-state>
      </div>
    </div>
    <!-- <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="subheader">Sales</div>
                      <div class="ms-auto lh-1">
                        <div class="dropdown">
                          <a class="dropdown-toggle text-secondary" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item active" href="#">Last 7 days</a>
                            <a class="dropdown-item" href="#">Last 30 days</a>
                            <a class="dropdown-item" href="#">Last 3 months</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="h1 mb-3">75%</div>
                    <div class="d-flex mb-2">
                      <div>Conversion rate</div>
                      <div class="ms-auto">
                        <span class="text-green d-inline-flex align-items-center lh-1">
                          7%
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 17l6 -6l4 4l8 -8"></path><path d="M14 7l7 0l0 7"></path></svg>
                        </span>
                      </div>
                    </div>
                    <div class="progress progress-sm">
                      <div class="progress-bar bg-primary" style="width: 75%" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="75% Complete">
                        <span class="visually-hidden">75% Complete</span>
                      </div>
                    </div>
                  </div> -->
  </div>
</template>

<script>
/**
 * @file:    \components\b\game.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Wed Nov 29 2023
 **/

export default {
  name: 'Game',
  props: {
    appid: {
      type: String,
      default: null,
    },
  },
  //  {
  //   app: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    return {
      app: {},
      iPoster: 0,
    }
  },

  computed: {
    ...mapStores(useDataStore),

    poster() {
      const ID = this.app.steam_id
      const posters = [
        `https://steamcdn-a.akamaihd.net/steam/apps/${ID}/library_600x900.jpg`,
        `https://cdn.akamai.steamstatic.com/steam/apps/${ID}/header.jpg`,
      ]

      return posters[this.iPoster]
    },
  },

  methods: {
    setState(state) {
      // this.app.state = state.id
    },

    async get() {
      this.app = await this.dataStore.get(this.appid)
    },
  },

  mounted() {
    this.get()
  },
}
</script>

<style>
.card.card-game {
  /* border: 1px solid red; */
}

.card-game .poster {
}

.card-game img {
  /* object-fit: cover; */
  aspect-ratio: 2 / 3;
  outline: 1px solid rgba(255, 255, 255, 0.15);
  outline-offset: -1px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
}
/*
.card.card-game::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  poster-color: rgb(120 120 120 / 50%); adjust opacity as needed
} */
</style>
