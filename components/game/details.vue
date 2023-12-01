<template>
  <b-dialog v-model="ui.dialog">
    <h1>{{ app.name }}</h1>
    <pre>{{ app }}</pre>
  </b-dialog>
</template>
<script>
/**
 * @file:    \components\b\details.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 1st December 2023
 * Modified: Fri Dec 01 2023
 **/

export default {
  data() {
    return {
      app: {},
      ui: {
        dialog: false,
      },
    }
  },

  mounted() {
    this.$mitt.on('game:modal', (app) => {
      this.app = app
      this.ui.dialog = true
    })
  },
}
</script>
