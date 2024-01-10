<template>
  <div>
    <h1>--</h1>
    <p>Here are some miscellaneous things.</p>
    <pre>
      {{ message }}
    </pre>
    <button @click="doit">Do it</button>
    <div class="battery-log"></div>

    <b-btn @click="ui.dialog = true">dialog</b-btn>
    <b-dialog v-model="ui.dialog">
      <h1>Dialog</h1>
    </b-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello World!',

      ui: {
        dialog: false,
      },
    }
  },

  methods: {
    doit() {
      const logEl = document.querySelector('.battery-log')

      const battery = {
        charged: '0%',
        cycles: 120,
      }

      this.$anime({
        targets: battery,
        charged: '100%',
        cycles: 130,
        round: 1,
        easing: 'linear',
        update: function () {
          logEl.innerHTML = JSON.stringify(battery)
        },
      })
    },
  },
}
</script>
