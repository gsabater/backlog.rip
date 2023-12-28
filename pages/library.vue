<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <div class="page-pretitle">All games</div>
          <h2 class="page-title">Library</h2>
        </div>
        <div class="col-auto ms-auto">
          <div class="text-secondary mt-1 text-right" style="text-align: right">
            About {{ $app?.api?.games?.total || 0 }} games
            <!-- <br />
            <span class="text-muted" style="zoom: 0.8">(0.19 seconds)</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <search-interface source="library"></search-interface>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\library.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th December 2023
 * Modified: Thu Dec 28 2023
 **/

export default {
  data() {
    return {}
  },

  computed: {
    // ...mapStores(useDataStore),
  },

  methods: {},

  mounted() {
    window.dev = this
  },
}
</script>
