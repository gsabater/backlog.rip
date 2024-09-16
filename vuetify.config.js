/*
 * @file:    \vuetify.config.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 30th July 2024
 * Modified: Fri 23 August 2024 - 19:36:14
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

    VSelect: { variant: 'outlined' },
  },
})
