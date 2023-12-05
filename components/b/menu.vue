<template>
  <div
    v-if="!ui.isReady || (ui.isReady && ui.show)"
    ref="dropdown"
    class="b-menu dropdown-menu nope-dropdown-menu-end nope-dropdown-menu-arrow"
    :class="{ show: ui.show }"
    nopestyle="`
      position: absolute;
      top: 0px;
      left: 0px;
      transform: translate3d(${posX}px, ${posY}px, 0px);
      will-change: transform;`"
    @click="hide">
    <slot />
    <!-- <a class="dropdown-item" href="#">Last 3 months</a> -->
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
 * Modified: Sun Dec 03 2023
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
  },

  data() {
    return {
      parent: null,
      posX: 0,
      posY: 0,

      ui: {
        show: false,
        active: false,
        isReady: false,
      },
    }
  },

  computed: {
    colorAndVariant() {
      if (this.variant == 'icon') return `btn-${this.color} btn-icon`
      if (this.variant == 'pill') return `btn-pill btn-${this.color}`

      let className = 'btn'

      if (this.variant) className += `-${this.variant}`
      if (this.color) className += `-${this.color}`

      if (Object.prototype.hasOwnProperty.call(this.$attrs, 'block'))
        className += ` w-100`
      if (Object.prototype.hasOwnProperty.call(this.$attrs, 'disabled'))
        className += ` disabled`

      return className
    },
  },

  methods: {
    toggle(e) {
      this.ui.show = !this.ui.show

      const position = this.parent.getBoundingClientRect()
      console.warn('🔥', position)
      this.posX = position.x
      this.posY = position.y

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
