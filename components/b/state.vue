<template>
  <div
    v-tippy="manager ? 'Click to change' : ''"
    class="status small"
    :class="{ 'cursor-pointer': manager }"
    style="border-radius: 4px"
    :style="{ '--tblr-status-color': st.color }"
    @click.stop="manage($event)">
    <span
      v-if="from"
      :style="{ color: oldst.color + ' !important' }"
      style="font-size: 0.775rem">
      {{ oldst.name || 'Not in your backlog' }}
      <Icon class="mx-1" style="color: #666">ArrowRightRhombus</Icon>
    </span>

    <span class="status-dot" :class="{ 'status-dot-animated': pulse && state }"></span>
    <template v-if="label">
      {{ st.name || 'Not in your backlog' }}
      <slot />
    </template>
  </div>
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
 * Modified: Mon Mar 11 2024
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

    from: {
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

    manager: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      // states: [],
    }
  },

  computed: {
    ...mapStores(useDataStore),
    ...mapState(useStateStore, ['states']),

    st() {
      return this.states.find((s) => s.id == this.state) || {}
    },

    oldst() {
      return this.states.find((s) => s.id == this.from) || {}
    },
  },

  methods: {
    //+-------------------------------------------------
    // manage()
    // Invoques the game manager
    // -----
    // Created on Sat Jan 06 2024
    //+-------------------------------------------------
    manage($event) {
      if (!this.manager) return

      this.$mitt.emit('game:manager', {
        $ev: $event,
        app: this.app,
      })
    },

    init() {},
  },

  mounted() {
    // this.init()
  },
}
</script>
