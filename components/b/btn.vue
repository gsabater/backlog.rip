<template>
  <div :class="`btn ${colorAndVariant}`">
    <slot />
  </div>
</template>

<script>
/**
 * @file:    \components\b\btn.vue
 * @desc:    https://preview.tabler.io/buttons.html
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Sun Nov 12 2023
 **/

export default {
  name: 'tabler-btn',
  props: {
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
}
</script>

<style></style>
