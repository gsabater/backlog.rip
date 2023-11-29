<template>
  <div class="row">
    <div class="col">
      <pre>
        {{ repository }}
      </pre>
    </div>
  </div>
  <div class="row row-deck row-cards">
    <template v-for="(app, i) in items" :key="'card' + i">
      <div class="col col-6 col-lg-25">
        <b-game :key="app" :appid="app"></b-game>
      </div>
    </template>
  </div>
</template>

<script>
/**
 * @file:    \components\search\results.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Wed Nov 29 2023
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
      items: [],

      repository: {
        timer: null,
        delay: 500,
      },

      base: {
        string: '',
        ready: true,
      },

      ui: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),

    //+-------------------------------------------------
    // mergeFilters()
    // Initializes this.f
    // With values from props and presets
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    // f() {
    //   return { ...this.base, ...this.filters }
    // },

    // items() {
    //   log('⚡ Filter')
    //   if (!this.filters.ready) return []

    //   log('⚡ Filtering')
    //   console.time('Filter')

    //   const source = this.dataStore.list()

    //   const items = []

    //   for (const uuid in source) {
    //     const app = source[uuid]
    //     // console.log(app)

    //     // Filter: Name
    //     // Match with on app.name and steam_id
    //     //+---------------------------------------
    //     if (this.f?.string?.length > 0) {
    //       let appName = app.name ? app.name : ''
    //       appName = appName.toString().toLowerCase()

    //       if (
    //         appName.indexOf(this.filters.string) === -1 &&
    //         app.steam_id.toString() !== this.filters.string
    //       ) {
    //         // counters.skip++
    //         // data.hidden.string.push(steam_id)
    //         continue
    //       }
    //     }

    //     // Finally, add the app to items
    //     //+---------------------------------------
    //     items.push(uuid)
    //   }

    //   console.timeEnd('Filter')

    //   return items

    //   return this.items
    //     .sort((a, b) => b.playtime_forever - a.playtime_forever)
    //     .map((item) => ({
    //       ...item,
    //       import: true,
    //     }))
    //     .slice(0, 10)
    // },
  },

  methods: {
    //+-------------------------------------------------
    // search()
    // Handles throttling of search to the API
    // And executes a filter()
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    search() {
      log('⚡ Searching')

      this.filter()

      if (!this.filters?.string || this.filters?.string?.length < 3) return

      const json = JSON.stringify(this.filters)
      const hash = btoa(json)
      this.dataStore.search(hash)
    },

    //+-------------------------------------------------
    // filter()
    //
    // -----
    // Created on Thu Nov 23 2023
    //+-------------------------------------------------
    filter() {
      log('⚡ Filtering')
      if (!this.dataStore.isReady) return

      console.time('Filter')

      const items = []
      const source = this.dataStore.list()

      log('⚡ Filtering with', JSON.stringify(this.filters))
      log('Filtering #', Object.keys(source).length)

      for (const uuid in source) {
        const app = source[uuid]
        // console.log(app)

        // Filter: Name
        // Match with on app.name and steam_id
        //+---------------------------------------
        if (this.filters?.string?.length > 0) {
          let appName = app.name ? app.name : ''
          appName = appName.toString().toLowerCase()

          if (
            appName.indexOf(this.filters.string) === -1 &&
            app.steam_id.toString() !== this.filters.string
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
      log('⚡ Found', items.length, items[0], window.db?.data?.[items[0]])

      this.items = items.slice(0, 100)

      // return this.items
      //   .sort((a, b) => b.playtime_forever - a.playtime_forever)
      //   .map((item) => ({
      //     ...item,
      //     import: true,
      //   }))
      //   .slice(0, 10)

      this.$forceUpdate()
    },

    init() {
      log('Loading repositories')
      this.dataStore.init() // <- this should be some kind of event fired from the store
      this.search()
    },
  },
  mounted() {
    this.init()

    this.$mitt.on('data:updated', () => {
      log('⭕ Starting a search from an event -> data:updated')
      this.search()
    })

    this.$mitt.on('data:ready', () => {
      log('⭕ Starting a search from an event -> data:ready')
      this.search()
    })
  },

  unmounted() {
    this.$mitt.off('data:updated')
  },
}
</script>

<style>
@media (min-width: 992px) {
  .col-lg-25 {
    flex: 0 0 auto;
    width: 20%;
  }
}

.col-25 {
  flex: 0 0 auto;
  width: 20%;
}
</style>
