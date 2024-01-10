<template>
  <div class="page-body">
    <div class="container-xl">
      <h1>
        {{ slug }}
      </h1>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\games.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 21st November 2022
 * Modified: Mon Dec 18 2023
 **/

export default {
  data() {
    return {}
  },

  computed: {
    // ...mapStores(useDataStore),

    slug() {
      return this.$route.params.slug
    },
  },

  methods: {},

  mounted() {
    window.dev = this
  },
}
</script>
