<template>
  <span class="status" :style="{ '--tblr-status-color': st.color }">
    <span class="status-dot status-dot-animated"></span>
    <template v-if="label">
      {{ st.name }}
      <slot />
    </template>
  </span>
</template>

<script>
/**
 * @file:    \components\b\state.vue
 * @desc:    ...
 * -------------------------------------------
 * Can be used as
 * <BState :state="state"></BState>
 * -------------------------------------------
 * TODO: Add support for multiple props: label and dot
 * -------------------------------------------
 * Created Date: 26th December 2023
 * Modified: Thu Dec 28 2023
 **/

export default {
  name: 'State',
  props: {
    state: {
      type: [String, Number],
      default: null,
    },

    dot: {
      type: Boolean,
      default: true,
    },

    label: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      states: [],
    }
  },

  computed: {
    ...mapStores(useDataStore),

    st() {
      return this.states.find((s) => s.id == this.state) || {}
    },
  },

  methods: {
    getData() {
      this.states = this.dataStore.states()
    },

    init() {
      this.getData()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
