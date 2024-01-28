/*
 * @file:    \plugins\nprogress.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th January 2024
 * Modified: Mon Jan 22 2024
 */

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

export default defineNuxtPlugin(() => {
  let nprogress = Nprogress
  nprogress.configure({ parent: '.page-wrapper', showSpinner: false })

  window.$nprogress = nprogress
  return {
    provide: {
      nprogress,
    },
  }
})
