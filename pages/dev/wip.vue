<template>
  <div class="page-body">
    <div class="container-xl">
      <h2>&nbsp;</h2>

      <div class="row">About ~{{ format.num($app.count.api) }} games</div>
      <div class="row">About ~{{ format.num($app.count.library) }} games</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wip',
  setup() {
    definePageMeta({
      layout: 'dev',
    })
    return {}
  },

  data() {
    return {
      f: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),
  },

  methods: {
    init() {
      this.dataStore.loadApiStatus()
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style></style>
