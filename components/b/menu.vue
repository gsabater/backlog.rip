<template>
  <div
    ref="dropdown"
    class="b-menu dropdown-menu"
    :class="{ show: ui.show }"
    @click="hide">
    <slot />
    <!-- <a class="dropdown-item" href="#">Last 3 months</a> -->
    <!-- <div
      class="menu-area"

      style="
        background-color: rgba(255, 0, 0, 0.351);
        width: 200%;
        height: 300px;
        position: absolute;
        top: -30px;
        left: -50%;
        z-index: -1;
      ">
      </div> -->
  </div>
</template>

<script>
/**
 * @file:    \components\b\btn.vue
 * @desc:    https://preview.tabler.io/dropdowns.html
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Sun Nov 12 2023
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

  data: () => ({
    parent: null,

    ui: {
      show: false,
      active: false,
      isReady: false,
    },
  }),

  computed: {
    colorAndVariant() {
      if (this.variant == 'icon') return `btn-${this.color} btn-icon`
      if (this.variant == 'pill') return `btn-pill btn-${this.color}`

      let className = 'btn'

      if (this.variant) className += `-${this.variant}`
      if (this.color) className += `-${this.color}`

      if (this.$attrs.hasOwnProperty('block')) className += ` w-100`
      if (this.$attrs.hasOwnProperty('disabled')) className += ` disabled`

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

    async smartHide() {
      console.warn('out', this.ui.active, this.ui.show)
      await delay(3000)
      console.warn('hiding?', this.ui.active)
      if (this.ui.active) this.hide()
    },

    async enableMenu() {
      if (this.activator == 'parent')
        this.parent = this.$refs.dropdown.previousElementSibling

      if (this.parent) {
        log('parent', this.parent)
        this.parent.addEventListener('click', this.toggle)
      }
      // await delay(300)
      // if (this.element && !this.element.dropdownId) {
      //   // this.element.addEventListener('click', this.toggle)
      //   this.element.dropdownId = this.id
      //   console.error('added event listener', this.element, this.id)
      // }
    },

    async init() {
      await delay(300)
      this.ui.isReady = true
      this.enableMenu()
      // window.addEventListener('click', this.hide)
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style></style>
