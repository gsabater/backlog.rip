<template>
  <div ref="dropdown" class="dropdown-menu" :class="{'show': show}">
    <a class="dropdown-item active" href="#">Last 7 days</a>
    <slot />
    <a class="dropdown-item" href="#">Last 30 days</a>
    <a class="dropdown-item" href="#">Last 3 months</a>
  </div>

  <pre>
    show: {{ show }}
    element: {{ element }}
  </pre>
</template>

<script>
/**
 * @file:    \components\b\btn.vue
 * @desc:    https://preview.tabler.io/dropdowns.html
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Wed Nov 08 2023
 **/

export default {
  props: {
    name: 'dropdown-menu',
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
    id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    show: false,
    element: null,
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
      this.show = !this.show

      e.preventDefault()
      e.stopPropagation()
    },

    hide() {
      this.show = false
    },

    // async enableMenu() {
    //   // if (this.activator == 'parent') this.element = this.$refs.dropdown.previousElementSibling

    //   // await delay(300)

    //   // if (this.element && !this.element.dropdownId) {
    //   //   // this.element.addEventListener('click', this.toggle)
    //   //   this.element.dropdownId = this.id
    //   //   console.error('added event listener', this.element, this.id)
    //   // }
    // },

    init() {
      this.enableMenu()
      // window.addEventListener('click', this.hide)
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style>
</style>
