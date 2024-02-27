<template>
  <div class="page-body">
    <div class="container-xl">
      <h2>&nbsp;</h2>

      <div class="row">About ~{{ format.num($app.count.api) }} games</div>
      <div class="row">About ~{{ format.num($app.count.library) }} games</div>

      <div class="btn" @click="show = true">xxx</div>
      <b-modal v-model="show" title="Hello World!" @confirm="() => confirm()">
        <p>VModel: The content of the modal</p>
      </b-modal>
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
      show: false,
      f: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),
  },

  methods: {
    confirm() {
      console.log('confirm✅✅✅✅')
      this.show = false
    },

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
