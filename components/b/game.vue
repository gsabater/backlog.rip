<template>
  <div
    v-if="app && app.uuid"
    class="card-game"
    :class="app.state ? 'has-state' + app.state : ''">
    <div class="card-game__cover" @click.stop="showGameModal">
      <div
        v-if="app.error"
        style="
          color: rgba(152, 75, 75, 0.716);
          font-size: 1rem;
          text-align: center;
          z-index: 666;
        ">
        {{ app.error }}
      </div>
      <template v-else>
        <BState :app="app.uuid" :state="app.state" :label="false"></BState>
        <game-asset
          ref="cover"
          :app="app"
          asset="cover"
          :priority="['steam', 'igdb']"></game-asset>
      </template>
    </div>

    <div v-if="body" class="card-body">
      <span class="h5">
        {{ app.name }}
      </span>
      <div class="text-muted">
        halal
        <!-- {{ uuid }} -->
        <!-- {{ app.steam_id }} -->
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
 * Modified: Thu Feb 15 2024
 **/

export default {
  name: 'Game',
  props: {
    uuid: {
      type: String,
      default: null,
    },

    body: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      app: {},

      ui: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),
  },

  methods: {
    showGameModal() {
      this.$mitt.emit('game:modal', {
        uuid: this.app.uuid,
        $list: this.$parent,
      })
    },

    manage($event) {
      this.$mitt.emit('game:manager', $event, this.app.uuid)
    },

    async getData() {
      this.app = this.dataStore.get(this.uuid)
    },
  },

  mounted() {
    this.getData()

    this.$mitt.on('state:change', (payload) => {
      if (payload.uuid != this.app.uuid) return
      this.app.state = payload.state
      this.$forceUpdate()
    })
  },

  beforeUnmount() {
    this.$mitt.off('state:change')
  },
}
</script>
