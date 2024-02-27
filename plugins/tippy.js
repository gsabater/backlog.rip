/*
 * @file:    \plugins\tippy.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th December 2023
 * Modified: Tue Feb 27 2024
 */

import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/svg-arrow.css'
import 'tippy.js/dist/backdrop.css'

import 'tippy.js/animations/shift-away.css'
import 'tippy.js/animations/shift-away-subtle.css'
import 'tippy.js/animations/shift-away-extreme.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/animations/scale-subtle.css'
import 'tippy.js/animations/scale-extreme.css'

import 'tippy.js/themes/material.css'
import 'tippy.js/themes/translucent.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTippy, {
    defaultProps: {
      arrow: false,

      animateFill: false,
      theme: 'material',
      // theme: 'translucent',

      animation: 'shift-away',
    },
    flipDuration: 0,
  })
})
