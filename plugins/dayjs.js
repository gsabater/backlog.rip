/*
 * @file:    \plugins\dayjs.js
 * @desc:    https://kas.kim/blog/using-dayjs-in-nuxt-3-as-plugin/
 * ----------------------------------------------
 * Created Date: 28th February 2023
 * Modified: Thu 29 August 2024 - 09:52:58
 */

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'

// import 'dayjs/locale/es'
// dayjs.locale('es')

dayjs.extend(isBetween)
dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)
dayjs.extend(localizedFormat)

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      dayjs: dayjs,
      moment: dayjs,
    },
  }
})
