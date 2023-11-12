<template>
  <!-- <template v-if="variant == 'floating'">
    <div class="form-floating" >
  </template> -->

  <label v-if="label" class="form-label" :class="{ required: required }">
    {{ label }}
  </label>

  <input
    type="text"
    :class="colorAndVariant"
    v-bind="$attrs"
    v-model="inputValue"
    @input="$emit('input', $event.target.value)" />

  <div v-if="hint" class="small text-secondary">
    {{ hint }}
  </div>

  <!-- <template v-if="variant == 'floating'">
      <label class="form-label"
        :class="{'required': required}"
        v-if="variant == 'floating'">{{ label }}</label>
      </div>
    </template> -->
</template>

<script>
/**
 * @file:    \components\b\input.vue
 * @desc:    https://preview.tabler.io/form-elements.html
 * @ref:     https://vuetifyjs.com/en/components/text-fields/#usage
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Sun Nov 12 2023
 **/

export default {
  name: 'TablerInput',
  props: {
    id: {
      type: String,
      default:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
    },

    label: {
      type: String,
      default: '',
    },

    hint: {
      type: String,
      default: '',
    },

    required: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'regular',
      options: ['regular', 'sm', 'lg'],
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
      let className = 'form-control'
      if (this.size !== 'regular') className += ` form-control-${this.size}`
      return className
    },
  },
}
</script>

<style></style>
