/*
 * @file:    \plugins\dayjs.js
 * @desc:    https://kas.kim/blog/using-dayjs-in-nuxt-3-as-plugin/
 * ----------------------------------------------
 * Created Date: 28th February 2023
 * Modified: Tue 15 April 2025 - 15:47:10
 */

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'

// import 'dayjs/locale/es'
// dayjs.locale('es')

dayjs.extend(isBetween)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
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
