<template>
  <div class="row row-deck row-cards">
    <template v-for="(app, i) in items" :key="'game' + i">
      <div class="col col-3">
        <b-game :app="440"></b-game>
      </div>
    </template>
  </div>

  <div class="card">
    <div class="list-group card-list-group">
      <div v-for="(app, i) in items" :key="'game' + i" class="list-group-item">
        <div class="row g-2 align-items-center">
          <!-- <div class="col-auto fs-3">
            <label class="form-check form-switch">
              <input class="form-check-input" type="checkbox"
                v-model="app.import">
            </label>
          </div> -->
          <div class="col-auto"><input type="checkbox" class="form-check-input" /></div>

          <div class="col-auto">
            <img
              v-if="i < 60"
              loading="lazy"
              :src="`https://cdn.akamai.steamstatic.com/steam/apps/${app.appid}/capsule_184x69.jpg?t=1699291031`"
              class="bl-image"
              style="max-width: 100%; cursor: pointer" />
          </div>
          <div class="col">
            {{ app.name }}
            <pre>
              {{ app }}
            </pre>
            <!-- <div class="text-secondary">
              GOLEC UORKIESTRA,
              Gromee,
              Bedoes
            </div> -->
          </div>
          <div class="col-auto text-secondary">03:41</div>
          <div class="col-auto">
            <a href="#" class="link-secondary">
              <button class="switch-icon" data-bs-toggle="switch-icon">
                <span class="switch-icon-a text-muted">
                  <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
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
                    <path
                      d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                  </svg>
                </span>
                <span class="switch-icon-b text-red">
                  <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-filled"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                  </svg>
                </span>
              </button>
            </a>
          </div>
          <div class="col-auto lh-1">
            <div class="dropdown">
              <a href="#" class="link-secondary" data-bs-toggle="dropdown">
                <!-- Download SVG icon from http://tabler-icons.io/i/dots -->
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
                  <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                </svg>
              </a>
              <b-menu>
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
              </b-menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\results.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Wed Nov 22 2023
 **/

export default {
  name: 'SearchResults',
  components: {},

  props: {
    source: {
      type: Array,
      default: () => [],
    },

    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      base: {
        string: '',
        ready: true,
      },

      ui: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),

    f() {
      return { ...this.base, ...this.filters }
    },

    items() {
      log('⚡ Filter')
      if (!this.f.ready) return []

      log('⚡ Filtering')
      console.time('Filter')

      const source = this.dataStore.list()

      const items = []

      for (const uuid in source) {
        const app = source[uuid]
        console.log(app)

        // Filter: Name
        // Match with on app.name and steam_id
        //+---------------------------------------
        if (this.f?.string?.length > 0) {
          let appName = app.name ? app.name : ''
          appName = appName.toString().toLowerCase()

          if (
            appName.indexOf(this.f.string) === -1 &&
            app.steam_id.toString() !== this.f.string
          ) {
            // counters.skip++
            // data.hidden.string.push(steam_id)
            continue
          }
        }

        // Finally, add the app to items
        //+---------------------------------------
        items.push(uuid)
      }

      console.timeEnd('Filter')

      return items

      return this.items
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .map((item) => ({
          ...item,
          import: true,
        }))
        .slice(0, 10)
    },
  },

  methods: {
    //+-------------------------------------------------
    // setFilters()
    // Initializes this.f
    // With values from props and presets
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    setFilters() {
      this.f = {
        ...this.base,
        ...this.filters,
      }
    },

    init() {
      this.setFilters()

      log('Loading repositories')
      this.dataStore.init()
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style></style>
