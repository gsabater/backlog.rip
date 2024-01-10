<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <div class="page-pretitle">Browsing</div>
          <h2 class="page-title">All games</h2>
        </div>
        <div v-if="source.count > 0" class="col-auto ms-auto">
          <div class="text-secondary mt-1 text-right" style="text-align: right">
            About ~{{ format.num(source.count) }} games
            <!-- <br />
            <span class="text-muted" style="zoom: 0.8">(0.19 seconds)</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <search-interface></search-interface>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\games.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 21st November 2022
 * Modified: Wed Jan 10 2024
 **/

export default {
  data() {
    return {
      source: {
        is: 'all',
        count: 0,
      },
    }
  },

  computed: {
    // ...mapStores(useDataStore),
  },

  methods: {
    init() {
      window.setTimeout(() => {
        this.source.count = this.$app.api?.games?.total
      }, 1000)
    },
  },

  mounted() {
    this.init()
  },
}
</script>
