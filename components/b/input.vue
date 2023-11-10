<template>
  <div class="form-floating" v-if="variant == 'floating'">
    <input
      type="text"
      class="form-control"
      v-bind="$attrs"
      v-model="inputValue"
      @input="$emit('input', $event.target.value)">

    <label class="form-label"
      :class="{'required': required}"
      v-if="variant == 'floating'">{{ label }}</label>
  </div>

  <template v-else>
    <label class="form-label"
      :class="{'required': required}"
      v-if="variant !== 'floating'">{{ label }}</label>

    <input
      type="text"
      class="form-control"
      v-bind="$attrs"
      v-model="inputValue"
      @input="$emit('input', $event.target.value)">
  </template>
</template>

<script>
/**
 * @file:    \components\b\input.vue
 * @desc:    https://preview.tabler.io/form-elements.html
 * @ref:     https://vuetifyjs.com/en/components/text-fields/#usage
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Sun Nov 05 2023
 **/

export default {
  name: 'Input',
  props: {
    id: {
      type: String,
      default:
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    },

    label: {
      type: String,
      default: '',
    },

    required: {
      type: Boolean,
      default: false,
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

    value: {
      type: String,
      default: '',
    },
  },

  setup(props, { attrs }) {
    return {
      attrs,
    }
  },

  data() {
    return {
      inputValue: this.value,
    }
  },

  computed: {
    colorAndVariant() {
      if (this.variant == 'icon') return `btn-icon btn-${this.color}`
      return `btn-${this.variant}-${this.color}`
    },
  },
}
</script>

<style>
</style>
