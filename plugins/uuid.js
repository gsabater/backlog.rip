/*
 * @file:    \plugins\uuid.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 27th March 2023
 * Modified: Tue Apr 16 2024
 */

import { v4 } from 'uuid'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      uuid: v4,
    },
  }
})
