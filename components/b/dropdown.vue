<template>
  <tippy
    ref="tippy"
    tag="div"
    content-tag="div"
    theme="dropdown"
    :trigger="trigger"
    :placement="placement"
    :interactive="true"
    :interactive-debounce="debounce"
    animation="shift-away-subtle"
    :duration="duration"
    :to="to"
    :append-to="appendTo || (() => document.body)">
    <!-- <template #default="{ state }">
      <div>{{ state }}</div>
    </template> -->

    <template #content="{ hide }">
      <div class="b-menu dropdown-menu show" v-bind="$attrs" @click="hide">
        <slot />
      </div>
    </template>
  </tippy>
</template>

<script>
/**
 * @file:    \components\b\dropdown.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 7th February 2024
 * Modified: 16th October 2025 - 02:32:25
 **/

import { singletonManager } from '~/utils/singletonManager'

export default {
  name: 'TippyDropdown',
  props: {
    to: {
      type: [String, Boolean],
      default: 'parent',
    },

    theme: {
      type: String,
      default: '',
      options: ['dropdown', 'card'],
    },

    // Singleton group
    // Used to group multiple tippys together
    //  so that only one is visible at a time
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    singletonGroup: {
      type: String,
      default: null,
    },

    trigger: {
      type: String,
      default: 'mouseenter focus',
      // options: ['click', 'hover', 'focus', 'manual'],
    },

    placement: {
      type: String,
      default: 'bottom-start',
      options: ['start', 'end', 'right-start'],
    },

    // Where to append the tippy element
    // Required to avoid overflow issues on groups
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    appendTo: {
      type: [String, Function],
      default: 'parent',
    },

    duration: {
      type: Array,
      default: () => [200, 250],
    },

    // Default value in vuetippy is 0
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    debounce: {
      type: Number,
      default: 45,
    },
  },

  data() {
    return {
      tippyInstance: null,
    }
  },

  methods: {
    async init() {
      // Register with singleton group if specified
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.singletonGroup && this.$refs.tippy) {
        this.$nextTick(() => {
          this.tippyInstance = this.$refs.tippy?.tippy
          if (this.tippyInstance) {
            // Register with the global singleton manager
            singletonManager.register(this.singletonGroup, this.tippyInstance)
          }
        })
      }
    },
  },

  mounted() {
    this.init()
  },

  beforeUnmount() {
    // Clean up singleton registration
    if (this.singletonGroup && this.tippyInstance) {
      singletonManager.unregister(this.singletonGroup, this.tippyInstance)
    }
  },
}
</script>
