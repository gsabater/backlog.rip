<template>
  <tippy
    ref="tippy"
    to="parent"
    tag="div"
    content-tag="div"
    :trigger="trigger"
    :placement="placement"
    :interactive="true"
    :interactive-debounce="45"
    animation="shift-away-subtle"
    :duration="[200, 250]"
    theme="dropdown">
    <!-- <template #default="{ state }">
      <div>{{ state }}</div>
    </template> -->

    <template #content="{ hide }">
      <div class="b-menu dropdown-menu show" @click="hide" v-bind="$attrs">
        <slot />
      </div>
    </template>
  </tippy>
</template>

<script>
/**
 * @file:    \components\b\b-dropdown.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 7th February 2024
 * Modified: Thu Jul 11 2024
 **/

export default {
  name: 'TippyDropdown',
  props: {
    theme: {
      type: String,
      default: '',
      options: ['dropdown', 'card'],
    },

    trigger: {
      type: String,
      default: 'mouseenter focus',
      options: ['click', 'hover', 'focus', 'manual'],
    },

    placement: {
      type: String,
      default: 'bottom-start',
      options: ['start', 'end', 'right-start'],
    },
  },

  data() {
    return {
      parent: null,

      posY: 0,
      offsetX: 0,
      opacity: 0.5,

      ui: {
        show: false,
        active: false,
        isReady: false,
      },
    }
  },

  computed: {},

  methods: {
    async init() {
      // this.enableMenu()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
