<template>
  <div>
    <h1>Holder</h1>
    <pre>{{ items }}</pre>
    <template v-for="(i, img) in items" :key="i">
      <img :src="img" alt="" width="50" class="m-2" />
    </template>
  </div>
</template>
<script>
/**
 * @file:    \components\search\holder.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 1st December 2023
 * Modified: Fri Dec 01 2023
 **/

export default {
  name: 'SearchHolder',

  data() {
    return {
      items: {},

      ui: {},
    }
  },

  methods: {
    hold(poster) {
      if (!this.items[poster]) this.items[poster] = 0
      this.items[poster]++
    },
  },

  mounted() {
    this.$mitt.on('poster:hold', this.hold)
  },
}
</script>
