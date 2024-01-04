<template>
  <span
    class="status"
    style="border-radius: 4px"
    :style="{ '--tblr-status-color': st.color }"
    @click="manage($event)">
    <span class="status-dot" :class="{ 'status-dot-animated': pulse }"></span>
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
 * Created Date: 26th December 2023
 * Modified: Thu Jan 04 2024
 **/

export default {
  name: 'State',
  props: {
    app: {
      type: String,
      default: null,
    },

    state: {
      type: [String, Number],
      default: null,
    },

    // dot: {
    //   type: Boolean,
    //   default: true,
    // },

    pulse: {
      type: Boolean,
      default: true,
    },

    label: {
      type: Boolean,
      default: true,
    },

    // withManager: {
    //   type: Boolean,
    //   default: true,
    // },
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
    manage($event) {
      console.warn(this.$parent)
      debugger
      this.$mitt.emit('game:manager', $event, this.$parent.app)
    },

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
