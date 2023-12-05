<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-4">
          <h2>Set state</h2>
          <div class="card">
            <pre>
              {{ db }}
            </pre>
            <div class="card-body">
              <h3 class="card-title">Steps vertical</h3>
              <ul class="steps steps-vertical">
                <li class="step-item">
                  <div class="h4 m-0">Order received</div>
                  <div class="text-secondary">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
                    culpa cum expedita ipsam laborum nam ratione reprehenderit sed sint
                    tenetur!
                  </div>
                </li>
                <li class="step-item">
                  <div class="h4 m-0">Order received</div>
                  <div class="text-secondary">Lorem ipsum dolor sit amet.</div>
                </li>
                <li class="step-item active">
                  <div class="h4 m-0">Out for delivery</div>
                  <div class="text-secondary">Lorem ipsum dolor sit amet.</div>
                </li>
                <li class="step-item">
                  <div class="h4 m-0">Finalized</div>
                  <div class="text-secondary">Lorem ipsum dolor sit amet.</div>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <ul class="steps steps-counter steps-vertical">
                <li class="step-item">Step one</li>
                <li class="step-item">Step two</li>
                <li class="step-item active">Step three</li>
                <li class="step-item">Step four</li>
                <li class="step-item">Step five</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-8">
          <h2>Data store</h2>
          <b-btn @click="test">test</b-btn>
          <b-btn @click="giveme(440)">pepa</b-btn>
          <b-btn @click="status">Status</b-btn>
          <pre>
            {{ journalStore }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\journal\index.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 4th December 2023
 * Modified: Tue Dec 05 2023
 **/

export default {
  name: 'Journal',
  data() {
    return {
      db: {
        data: [],
      },
    }
  },

  computed: {
    ...mapStores(useJournalStore),
  },

  methods: {
    test() {
      // this.journalStore.pepa.a = 'pepa'
      // this.journalStore.pepe.b = 'pepe'
      // this.journalStore.db.c = 'pepc'
      this.journalStore.test()
    },

    async giveme(appid) {
      const pp = await this.journalStore.get(appid)
      debugger
    },

    async status() {
      this.journalStore.status()
    },

    async getData() {
      const jxr = await this.journalStore.list()
      this.db.data = jxr
    },

    async init() {
      this.getData()
    },
  },

  mounted() {
    this.init()

    window.dev = this
  },
}
</script>
