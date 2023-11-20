<template>
  <button :class="colorAndVariant">
    <slot />
  </button>
</template>

<script>
/**
 * @file:    \components\b\btn.vue
 * @desc:    https://preview.tabler.io/buttons.html
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Mon Nov 20 2023
 **/

export default {
  name: 'TablerBtn',
  props: {
    variant: {
      type: String,
      default: '',
      options: ['outline', 'ghost', 'square', 'pill'],
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    color: {
      type: String,
      default: '',
    },
  },

  computed: {
    colorAndVariant() {
      if (this.variant == 'icon') return `btn-${this.color} btn-icon`
      if (this.variant == 'pill') return `btn-pill btn-${this.color}`

      let className = 'btn'

      if (this.variant) className += ` btn-${this.variant}-${this.color}`
      if (this.color) className += ` btn-${this.color}`

      if (this.disabled === true) className += ` disabled`
      if (Object.prototype.hasOwnProperty.call(this.$attrs, 'block'))
        className += ` w-100`

      return className
    },
  },
}
</script>

<style></style>
