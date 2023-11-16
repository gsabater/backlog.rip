<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-8">
          <!-- <h3>Account History bby</h3>
          <games-browser
            :items="games"
            layout="list"
            layouts="list/grid/sheety"></games-browser> -->

          <hr />
          <h2>Filters interface</h2>
          <search-interface></search-interface>

          <h2>Data store</h2>
          <b-btn @click="test">test</b-btn>
          <b-btn @click="list">list</b-btn>
          <b-btn @click="giveme(440)">pepa</b-btn>
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
    list() {
      console.log(this.dataStore)
    },

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
  },
}
</script>
