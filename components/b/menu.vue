<template>
  <div
    v-if="!ui.isReady || (ui.isReady && ui.show)"
    ref="dropdown"
    class="b-menu dropdown-menu dropdown-menu-arrow show"
    :class="{ 'dropdown-menu-end': position == 'end' }"
    style="opacity: 0"
    :style="
      offsetX && opacity == 1
        ? `opacity: 1;transform: translate3d(${offsetX}px, ${posY}px, 0px);`
        : ''
    "
    @click="hide">
    <slot />
    <!-- <a class="dropdown-item" href="#">x: {{ offsetX }} - y: {{ posY }}</a>
    <a class="dropdown-item" href="#">opacity {{ opacity }}</a> -->
  </div>
  <div
    v-if="ui.show"
    class="dropdown-control"
    style="
      background-color: rgba(0, 0, 0, 0.1);
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 10;
      backdrop-filter: blur(0.5px);
    "
    @click="hide"></div>
</template>

<script>
/**
 * @file:    \components\b\btn.vue
 * @desc:    https://preview.tabler.io/dropdowns.html
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Thu Dec 21 2023
 **/

export default {
  name: 'TablerMenu',
  props: {
    activator: {
      type: String,
      default: 'parent',
      options: ['parent', 'self'],
    },

    variant: {
      type: String,
      default: '',
      options: ['outline', 'ghost', 'square', 'pill'],
    },

    color: {
      type: String,
      default: 'primary',
    },

    // WIP: revisar como es en vuetify para autohide
    persistent: {
      type: Boolean,
      default: false,
    },

    position: {
      type: String,
      default: 'start',
      options: ['start', 'end'],
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
    //+-------------------------------------------------
    // calcCorrection()
    // With current and parent position, try to calculate
    // offset amount to be 100% aligned with parent
    // -----
    // Created on Thu Dec 21 2023
    //+-------------------------------------------------
    calcCorrection() {
      const parent = this.parent.getBoundingClientRect()
      const dropdown = this.$refs.dropdown?.getBoundingClientRect()

      let anchorX = 0

      if (this.position == 'start') {
        if (parent.x !== dropdown.x) {
          anchorX = parent.x - dropdown.x
          console.warn(parent.x, dropdown.x, anchorX, this.offsetX)
        } else {
          anchorX = 1
        }
      }

      if (this.position == 'end') {
        if (parent.right !== dropdown.right) {
          anchorX = parent.right - dropdown.right
          console.warn(parent.right, dropdown.right, anchorX, this.offsetX)
        }
      }

      this.offsetX = anchorX
      this.opacity = 1
    },

    toggle(e) {
      this.offsetX = 0
      this.opacity = 0.5

      this.ui.show = !this.ui.show

      this.$nextTick(() => {
        window.setTimeout(() => {
          this.calcCorrection()
        }, 100)
      })

      e.preventDefault()
      e.stopPropagation()
    },

    async hide() {
      this.ui.show = false
      this.ui.active = false
    },

    async enableMenu() {
      if (this.activator == 'parent')
        this.parent = this.$refs.dropdown.previousElementSibling

      if (this.parent) {
        this.parent.addEventListener('click', this.toggle)
        this.ui.isReady = true
      }
    },

    async init() {
      await delay(300)
      this.enableMenu()
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style></style>
