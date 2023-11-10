/**
 * @project: KAAM
 * @file:    \plugins\uuid.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 27th March 2023
 * Last Modified: Mon Mar 27 2023
 **/

import * as uuid from 'uuid'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      uuid: uuid,
    },
  }
})
