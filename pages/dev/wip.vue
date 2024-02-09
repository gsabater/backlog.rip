<template>
  <div class="page-body">
    <div class="container-xl">
      <h2>&nbsp;</h2>

      <div class="row"></div>
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
      this.source.count = this.dataStore.count('library')
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style></style>
