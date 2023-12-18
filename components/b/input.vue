<template>
  <pre v-if="false">
  layout: {{ layout }}
  Attrs: {{ $attrs }}
  </pre>

  <!--
    Default layout
  -->
  <template v-if="layout == 'default'">
    <label v-if="label" class="form-label" :class="{ required: required }">
      {{ label }}
    </label>

    <input
      v-bind="$attrs"
      nv-model="inputValue"
      :type="type"
      :class="colorAndVariant"
      :value="modelValue"
      nchange="notify"
      nupdate:modelValue="notify"
      @input="onChange" />

    <div v-if="hint" class="small text-secondary">
      {{ hint }}
    </div>
  </template>

  <!--
    Layout with icon
    and clearable
  -->
  <template v-if="layout == 'with-icon'">
    <label v-if="label" class="form-label" :class="{ required: required }">
      {{ label }}
    </label>

    <div class="input-icon">
      <span v-if="$attrs['prepend-icon']" class="input-icon-addon">
        <Icon :icon="$attrs['prepend-icon']"></Icon>
      </span>

      <input
        v-bind="$attrs"
        nv-model="inputValue"
        :type="type"
        :class="colorAndVariant"
        :value="modelValue"
        nchange="notify"
        nupdate:modelValue="notify"
        @input="onChange" />

      <span v-if="$attrs['append-icon']" class="input-icon-addon">
        <Icon :icon="$attrs['append-icon']"></Icon>
      </span>

      <span
        v-if="clearable"
        class="input-icon-addon cursor-pointer action-icon"
        :class="{ active: modelValue !== '' }"
        @click="onClear">
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
  <!-- <div v-if="layout == 'floating'" class="form-floating">
    <input
      v-bind="$attrs"
      v-model="inputValue"
      :class="colorAndVariant"
      @change="notify"
      @update:modelValue="notify" />

    <label
      v-if="variant == 'floating'"
      class="form-label"
      :class="{ required: required }">
      {{ label }}
    </label>
  </div> -->
</template>

<script>
/**
 * @file:    \components\b\input.vue
 * @desc:    https://preview.tabler.io/form-elements.html
 * @ref:     https://vuetifyjs.com/en/components/text-fields/#usage
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Mon Dec 18 2023
 **/

export default {
  name: 'TablerInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },

    // value: {
    //   type: String,
    //   default: '',
    // },

    id: {
      type: String,
      default: () => 'input-' + Math.random().toString(36).substring(2, 10),
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
  },

  emits: ['clear', 'update:modelValue'],

  setup(props, { attrs }) {
    return {
      attrs,
    }
  },

  // data: (ctx) => ({
  //   inputValue: ctx.value,
  // }),

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

  // watch: {
  //   inputValue() {
  //     this.notify()
  //   },
  // },

  methods: {
    //+-------------------------------------------------
    // onChange()
    // Emits 'update:modelValue' that updates the v-model
    // on parent. this.modelValue is still the old value, thats
    // why we need to emit with the target value.
    // -----
    // @input is fired by parent on "keydown"
    // @change is fired by parent on "blur"
    // @clear is fired by parent onClear, just once
    // -----
    // Created on Mon Dec 18 2023
    //+-------------------------------------------------
    onChange(e) {
      const value = e?.target?.value || ''
      // console.warn('onChange', value, this.modelValue)
      this.$emit('update:modelValue', value)
    },

    onClear() {
      this.$emit('clear')
      this.onChange('')
    },
  },

  mounted() {},
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
