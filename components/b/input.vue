<template>
  <!-- <pre>
layout: {{ layout }}
Attrs: {{ $attrs }}
  </pre> -->

  <!--
    Default layout
  -->
  <template v-if="layout == 'default'">
    <label v-if="label" class="form-label" :class="{ required: required }">
      {{ label }}
    </label>

    <input
      v-bind="$attrs"
      v-model="inputValue"
      :type="type"
      :class="colorAndVariant"
      @input="$emit('input', $event.target.value)" />

    <div v-if="hint" class="small text-secondary">
      {{ hint }}
    </div>
  </template>

  <!--
    Layout with icon
  -->
  <template v-if="layout == 'with-icon'">
    <label v-if="label" class="form-label" :class="{ required: required }">
      {{ label }}
    </label>

    <div class="input-icon">
      <span v-if="$attrs['prepend-icon']" class="input-icon-addon">
        <!-- <svgs>{{  }}</svgs> -->
        <Icon :icon="$attrs['prepend-icon']"></Icon>
      </span>

      <input
        v-bind="$attrs"
        v-model="inputValue"
        :type="type"
        :class="colorAndVariant"
        @input="$emit('input', $event.target.value)" />

      <span v-if="$attrs['append-icon']" class="input-icon-addon">
        <!-- <svgs>{{ $attrs['append-icon'] }}</svgs> -->
        <Icon :icon="$attrs['append-icon']"></Icon>
      </span>

      <span
        v-if="clearable"
        class="input-icon-addon cursor-pointer action-icon"
        :class="{ active: inputValue !== '' }"
        @click="clear">
        <!-- <svgs>clearable</svgs> -->
        <Icon>SquareX</Icon>
      </span>

      <span v-if="loading" class="input-icon-addon">
        <div class="spinner-border spinner-border-sm text-secondary"></div>
      </span>
    </div>

    <div v-if="hint" class="small text-secondary">
      {{ hint }}
    </div>
  </template>

  <!--
    Variant Floating input
  -->
  <div v-if="layout == 'floating'" class="form-floating">
    <input
      v-bind="$attrs"
      v-model="inputValue"
      :class="colorAndVariant"
      @input="$emit('input', $event.target.value)" />

    <label
      v-if="variant == 'floating'"
      class="form-label"
      :class="{ required: required }">
      {{ label }}
    </label>
  </div>
</template>

<script>
/**
 * @file:    \components\b\input.vue
 * @desc:    https://preview.tabler.io/form-elements.html
 * @ref:     https://vuetifyjs.com/en/components/text-fields/#usage
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Wed Nov 22 2023
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

    type: {
      type: String,
      default: 'text',
      options: ['text', 'password', 'email', 'number'],
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

    clearable: {
      type: Boolean,
      default: false,
    },

    loading: {
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

  emits: ['input'],

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
    layout() {
      if (this.variant == 'floating') return 'floating'
      if (
        this.$attrs['prepend-icon'] ||
        this.$attrs['append-icon'] ||
        this.clearable ||
        this.loading
      )
        return 'with-icon'

      return 'default'
    },

    colorAndVariant() {
      let className = 'form-control'
      if (this.size !== 'regular') className += ` form-control-${this.size}`
      return className
    },
  },

  methods: {
    clear() {
      this.inputValue = ''
    },
  },
}
</script>

<style>
.action-icon {
  z-index: 1000;
  cursor: pointer;
  pointer-events: auto;
  opacity: 0;
  transition: all 0.15s ease;
}
.action-icon.active {
  opacity: 1;
}
</style>
