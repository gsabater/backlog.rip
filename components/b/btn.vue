<template>
  <!-- <pre v-if="false">
  Attrs: {{ $attrs }}
  </pre> -->
  <component v-bind="$attrs" :is="component" :to="to" :class="colorAndVariant">
    <slot />
  </component>
</template>

<script>
/**
 * @file:    \components\b\btn.vue
 * @desc:    https://preview.tabler.io/buttons.html
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Thu 17 October 2024 - 14:35:51
 **/
import { NuxtLink } from '#components'

export default {
  name: 'TablerBtn',

  props: {
    size: {
      type: String,
      default: '',
      options: ['sm', 'lg'],
    },

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

    to: {
      type: String,
      default: null,
    },
  },

  computed: {
    colorAndVariant() {
      if (this.variant == 'icon') return `btn-${this.color} btn-icon`
      if (this.variant == 'pill') return `btn-pill btn-${this.color}`

      let className = 'btn'

      if (this.variant) className += ` btn-${this.variant}-${this.color}`
      if (this.color) className += ` btn-${this.color}`
      if (this.size) className += ` btn-${this.size}`

      if (this.disabled === true) className += ` disabled`
      if (Object.prototype.hasOwnProperty.call(this.$attrs, 'block'))
        className += ` w-100`

      return className
    },

    component() {
      if (this.to) return NuxtLink
      return 'button'
    },
  },
}
</script>

<style></style>
