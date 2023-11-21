<template>
  <div class="page-body">
    <div class="container-xl">
      <search-interface></search-interface>
      <div class="row justify-content-center">
        <div class="col-8">
          <h2>Data store</h2>
          <b-btn @click="test">test</b-btn>
          <b-btn @click="giveme(440)">pepa</b-btn>
          <b-btn @click="status">Status</b-btn>
          <pre>
            {{ dataStore }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  computed: {
    ...mapStores(useDataStore),
  },

  methods: {
    test() {
      // this.dataStore.pepa.a = 'pepa'
      // this.dataStore.pepe.b = 'pepe'
      // this.dataStore.db.c = 'pepc'
      this.dataStore.test()
    },

    async giveme(appid) {
      const pp = await this.dataStore.get(appid)
      debugger
    },

    async status() {
      this.dataStore.status()
    },
  },

  mounted() {
    window.dev = this
  },
}
</script>
