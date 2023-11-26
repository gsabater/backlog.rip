<template>
  <div
    v-if="display"
    class="offcanvas-backdrop fade"
    :class="{ show: show }"
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
 * Modified: Sat Nov 25 2023
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
      this.show = false
      this.display = false

      this.$emit('backdrop:open', payload)
    },

    async hide() {
      this.show = false
      await delay(300)
      this.display = false

      this.$emit('backdrop:hide')
    },

    init() {},
  },

  mounted() {
    this.$mitt.on('backdrop:open', (payload) => {
      console.warn('backdrop:open', payload)
      this.open(payload)
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
