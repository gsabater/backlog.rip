import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// import * as labs from 'vuetify/labs/components'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

import {
  VBtn,
  VChip,
  VIcon,
  VForm,
  VSpacer,
  VDialog,
  VSnackbar,
  VTextField,
  VColorPicker,
  VProgressLinear,
  VCard,
  VCardText,
  VCardTitle,
  VCardActions,
} from 'vuetify/components'

import { md2 } from 'vuetify/blueprints'
import { en } from 'vuetify/locale'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,

    blueprint: md2,
    theme: {
      defaultTheme: 'dark',
    },

    locale: {
      locale: 'en',
      fallback: 'en',
      messages: { en },
    },

    components: {
      VBtn,
      VIcon,
      VChip,
      VForm,
      VDialog,
      VSpacer,
      VSnackbar,
      VTextField,
      VColorPicker,
      VProgressLinear,

      VCard,
      VCardText,
      VCardTitle,
      VCardActions,

      // ...labs,
      // ...components,
    },

    defaults: {
      global: {
        ripple: false,
      },

      VBtn: {
        variant: 'elevated',

        style: [{ textTransform: 'none' }],
      },

      VTextField: {
        class: '',
        variant: 'solo',
        flat: true,
        density: 'compact',
        hideDetails: 'auto',
      },

      VCard: {
        style: [{ background: '#20222b' }],
      },

      VSelect: { variant: 'outlined' },
    },

    // directives,
  })

  nuxtApp.vueApp.use(vuetify)
})
