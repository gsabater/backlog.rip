/*
 * @file:    \plugins\anime.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 1st December 2023
 * Modified: Fri Dec 01 2023
 */

import anime from 'animejs/lib/anime.es.js'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      anime,
    },
  }
})
