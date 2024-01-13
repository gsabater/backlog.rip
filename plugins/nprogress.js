/*
 * @file:    \plugins\nprogress.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th January 2024
 * Modified: Sat Jan 13 2024
 */

import Nprogress from 'nprogress'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      Nprogress,
    },
  }
})
