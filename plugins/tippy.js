/*
 * @file:    \plugins\tippy.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th December 2023
 * Modified: Sat Dec 16 2023
 */

import VueTippy, { roundArrow } from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
// import 'tippy.js/dist/backdrop.css'
import 'tippy.js/animations/shift-away-subtle.css'
import 'tippy.js/dist/svg-arrow.css'
import 'tippy.js/themes/material.css'

import 'tippy.js/themes/translucent.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTippy, {
    defaultProps: {
      // animateFill: true,
      // theme: 'material',
      theme: 'translucent',

      arrow: false,
      animation: 'shift-away-subtle',
    },
    flipDuration: 0,
  })
})
