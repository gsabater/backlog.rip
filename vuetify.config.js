/*
 * @file:    \vuetify.config.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 30th July 2024
 * Modified: Thu 17 October 2024 - 14:23:58
 */

import { md2 } from 'vuetify/blueprints'
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  // blueprint: md2,
  theme: {
    defaultTheme: 'dark',
  },

  components: [
    // 'VBtn',
    // 'VIcon',
    // 'VChip',
    // 'VForm',
    // 'VDialog',
    // 'VSpacer',
    // 'VSnackbar',
    // 'VTextField',
    // 'VColorPicker',
    // 'VProgressLinear',
  ],

  defaults: {
    global: {
      ripple: false,
    },

    VBtn: {
      variant: 'elevated',
      style: [{ textTransform: 'none' }],
    },

    VTextField: {
      flat: true,
      class: '',
      variant: 'solo',
      density: 'compact',
      hideDetails: 'auto',
    },

    VCard: {
      style: [{ background: '#20222b' }],
    },

    VSelect: {
      flat: true,
      class: '',
      variant: 'solo',
      density: 'compact',
      hideDetails: 'auto',
    },
  },
})
