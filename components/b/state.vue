<template>
  <slot name="container" :state="st">
    <div
      nopwv-tippy="manager ? 'Click to change' : ''"
      class="status small"
      :class="{ 'cursor-pointer': manager }"
      style="border-radius: 4px"
      :style="{ '--tblr-status-color': st.color }"
      @click.stop="showManager($event)">
      <span
        v-if="from"
        :style="{ color: oldst.color + ' !important' }"
        style="font-size: 0.775rem">
        {{ oldst.name || 'Not in your backlog' }}
        <Icon class="mx-1" style="color: #666">ArrowRightRhombus</Icon>
      </span>

      <Icon
        v-if="pinned"
        size="17"
        width="1.5"
        style="
          fill: #1f4112d9 !important;
          filter: drop-shadow(rgba(0, 0, 0, 0.41) 1px 1px 6px);
          stroke: #0b651c;
        ">
        BookmarkFilled
      </Icon>
      <Icon
        v-if="fav"
        size="17"
        width="1.5"
        style="color: red; fill: #ff000094; filter: drop-shadow(1px 1px 6px #00000069)">
        Heart
      </Icon>

      <span class="status-dot" :class="{ 'status-dot-animated': pulse && state }"></span>
      <template v-if="label">
        {{ st.name || 'Assign a state' }}
        <slot />
      </template>
    </div>
  </slot>
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
 * Modified: Wed 20 November 2024 - 12:58:09
 **/

export default {
  name: 'BState',
  props: {
    app: {
      type: String,
      default: null,
    },

    state: {
      type: [String, Number],
      default: null,
    },

    fav: {
      type: Boolean,
      default: false,
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    hidden: {
      type: Boolean,
      default: false,
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
    // showManager()
    // Invoques the game manager
    // -----
    // Created on Sat Jan 06 2024
    //+-------------------------------------------------
    showManager($event) {
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
