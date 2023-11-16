<template>
  <div>
    <pre>
      Filters
      {{ f }}
    </pre>
    <pre>
      base
      {{ base }}
    </pre>
    <pre>
      ui
      {{ ui }}
    </pre>
  </div>
</template>

<script>
/**
 * @file:    \components\b\backdrop.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 4th November 2023
 * Modified: Tue Nov 14 2023
 **/

export default {
  name: 'TablerBackdrop',
  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },

    preset: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    f: {},
    base: {
      string: '',
    },

    presets: {
      'my-preset': {
        string: 'my preset',
      },
    },

    ui: {},
  }),

  computed: {},

  methods: {
    open() {
      this.show = false
      this.display = false
    },

    async hide() {
      this.show = false
      await delay(300)
      this.display = false
    },

    //+-------------------------------------------------
    // setFilters()
    // Initializes this.f
    // With values from props and presets
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    setFilters() {
      this.f = {
        ...this.base,
        ...(this.preset ? this.presets[this.preset] : {}),
        ...this.filters,
      }
    },

    init() {},
  },

  mounted() {
    this.setFilters()
  },
}
</script>

<style>
.offcanvas-backdrop.show {
  opacity: 0.54;
  backdrop-filter: blur(4px);
}
</style>
