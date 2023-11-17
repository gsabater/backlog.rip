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
 * Modified: Fri Nov 17 2023
 **/

export default {
  name: 'TablerBtn',
  props: {
    variant: {
      type: String,
      default: '',
      options: ['outline', 'ghost', 'square', 'pill'],
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

      if (this.variant) className += ` btn-${this.variant}`
      if (this.color) className += ` btn-${this.color}`

      if (this.$attrs.hasOwnProperty('block')) className += ` w-100`
      if (this.$attrs.hasOwnProperty('disabled')) className += ` disabled`

      return className
    },
  },
}
</script>

<style></style>
