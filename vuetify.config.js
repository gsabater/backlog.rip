/*
 * @file:    \vuetify.config.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 30th July 2024
 * Modified: Mon 25 November 2024 - 17:35:05
 */

// import { md2 } from 'vuetify/blueprints'
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  // blueprint: md2,

  ssr: {
    clientWidth: 100,
  },

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
      variant: 'tonal',
      style: [{ textTransform: 'none', textDecoration: 'none' }],
    },

    VTextField: {
      flat: true,
      class: '',
      variant: 'solo',
      density: 'compact',
      hideDetails: 'auto',
    },

    VTextarea: {
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
