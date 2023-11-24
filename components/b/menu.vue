<template>
  <div ref="dropdown" class="b-menu dropdown-menu" :class="{ show: ui.show }">
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
 * Modified: Thu Nov 23 2023
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
  },

  data() {
    return {
      parent: null,

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
      }
    },

    async init() {
      await delay(300)
      this.ui.isReady = true
      this.enableMenu()
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style></style>
