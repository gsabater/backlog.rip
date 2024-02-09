<template>
  <div
    v-if="display"
    class="nope-offcanvas-backdrop fade"
    :class="{ show: show }"
    style="
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1040;
      width: 100vw;
      height: 100vh;
      background-color: #00000017;
      backdrop-filter: blur(2px);
    "
    @click="hide">
    <pre>
      <!-- {{ ID({id:123}) }} -->
    </pre>
  </div>
</template>

<script>
/**
 * @file:    \components\b\backdrop.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 4th November 2023
 * Modified: Thu Feb 08 2024
 **/

export default {
  name: 'TablerBackdrop',
  data() {
    return {
      show: false,
      display: false,
    }
  },

  computed: {},

  methods: {
    open(payload) {
      this.show = true
      this.display = true
    },

    async hide() {
      this.show = false
      await delay(300)
      this.display = false
    },

    init() {},
  },

  mounted() {
    this.$mitt.on('backdrop:open', (payload) => {
      this.open()
    })
  },
}
</script>

<style>
.offcanvas-backdrop.show {
  opacity: 0.54;
  backdrop-filter: blur(4px);
}
</style>
