<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <div class="page-pretitle">Your library</div>
          <h2 class="page-title text-capitalize">{{ source }}</h2>
        </div>
        <div class="col-auto ms-auto">
          <div class="text-secondary mt-1 text-right" style="text-align: right">
            {{ format.num($app.count.library) }} games
            <!-- <br />
            <span class="text-muted" style="zoom: 0.8">(0.19 seconds)</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <search-interface :source="is"></search-interface>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\library.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th December 2023
 * Modified: Thu Jun 20 2024
 **/

export default {
  data() {
    return {
      is: 'library',
    }
  },

  computed: {
    ...mapStores(useDataStore),

    source() {
      let slug = this.$route.params?.slug[0] || null
      if (slug == 'pinned') return 'pinned'
      return 'library'
    },
  },

  methods: {
    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
