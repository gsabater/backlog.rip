<template>
<div class="form-label">{{ label }}</div>
    <select
      ref="select"
      class="form-control"
      v-bind="$attrs"
      v-model="inputValue"
      @input="$emit('input', $event.target.value)"
      >
      <option
        v-for="(item, index) in selectOptions"
        :key="index"
        :value="item.value"
        :data-custom-properties="item.customProperties"
        >
        {{ item.text }}
      </option>
    </select>
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

import TomSelect from 'tom-select'

export default {
  name: 'Select',
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

    items: {
      type: Array,
      default: [],
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

    selectOptions() {
      return this.items.map((item) => {
        return {
          value: item,
          text: item,
        }
      })
    },
  },

  methods: {
    addTomSelect() {
      const options = {
        copyClassesToDropdown: false,
        dropdownParent: 'body',
        controlInput: '<input>',
        render: {
          item: function (data, escape) {
            if (data.customProperties) {
              return (
                '<div><span class="dropdown-item-indicator">' +
                data.customProperties +
                '</span>' +
                escape(data.text) +
                '</div>'
              )
            }
            return '<div>' + escape(data.text) + '</div>'
          },
          option: function (data, escape) {
            if (data.customProperties) {
              return (
                '<div><span class="dropdown-item-indicator">' +
                data.customProperties +
                '</span>' +
                escape(data.text) +
                '</div>'
              )
            }
            return '<div>' + escape(data.text) + '</div>'
          },
        },
      }
      const instance = new TomSelect(this.$refs.select, options)

      // @formatter:off
      // document.addEventListener("DOMContentLoaded", function () {
      // 	var el;
      // 	window.TomSelect && (new TomSelect(el = document.getElementById('select-states'), {
      // 		copyClassesToDropdown: false,
      // 		dropdownParent: 'body',
      // 		controlInput: '<input>',
      // 		render:{
      // 			item: function(data,escape) {
      // 				if( data.customProperties ){
      // 					return '<div><span class="dropdown-item-indicator">' + data.customProperties + '</span>' + escape(data.text) + '</div>';
      // 				}
      // 				return '<div>' + escape(data.text) + '</div>';
      // 			},
      // 			option: function(data,escape){
      // 				if( data.customProperties ){
      // 					return '<div><span class="dropdown-item-indicator">' + data.customProperties + '</span>' + escape(data.text) + '</div>';
      // 				}
      // 				return '<div>' + escape(data.text) + '</div>';
      // 			},
      // 		},
      // 	}));
      // });
      // @formatter:on
    },
  },

  mounted() {
    this.addTomSelect()
  },
}
</script>

<style>
</style>
